import { z } from 'zod';
import { RouteBase } from '../../../base/Route';
import { ErrorMaker } from '../../../libs/ErrorMaker';

export default class RedemptionsRoute extends RouteBase {
    validation = z.object({
        page: z
            .number({
                coerce: true,
            })
            .int()
            .min(1)
            .optional()
            .default(1),
        limit: z.number({ coerce: true }).int().min(1).max(100).optional().default(25),
        orderBy: z.enum(['createdAt']).default('createdAt'),
        sort: z.enum(['asc','desc']).default('desc'),
        channelId: z.string().optional(),
        accountId: z.string().optional()
    });

    constructor() {
        super({
            path: '/redemptions',
            middlewares: []
        });
    }

    run() {
        this.router.get('/', async (req,res)=>{
            try{
                const query = this.validation.safeParse(req.query)
                if(!query.success) throw new ErrorMaker({
                    type: 'form_validation',
                    errors: query.error.errors
                })

                const data = await this.dd.streamElementsRedemptions.listRedemptions({
                    ownerId: req.jwt.userId,
                    channelId: query.data.channelId,
                    accountId: query.data.accountId,
                    pagination:{
                        page: query.data.page,
                        limit: query.data.limit
                    },
                    order: {
                        sort: query.data.sort as any,
                        by: query.data.orderBy as any,
                    }
                })
                const count =  await this.dd.streamElementsRedemptions.countRedemptions({
                    ownerId: req.jwt.userId,
                    channelId: query.data.channelId,
                    accountId: query.data.accountId,
                })

                res.json({
                    data,
                    pagination: {
                        totalPages: Math.ceil(count/query.data.limit),
                        actualPage: query.data.page
                    }
                })
            }catch(e){
                console.log(e)
            }
        })
    }
}