import { RouteBase } from '../../../base/Route';
import { z } from 'zod';
import { ErrorMaker } from '../../../libs/ErrorMaker';

export default class UpdateDataProfilesRoute extends RouteBase {
    bodyValidator = z.object({
        accountId: z.string().nullable().default(null),
        nameComplete: z.string().nullable().default(null),
        firstName: z.string().nullable().default(null),
        pix: z.string().nullable().default(null),
        steamTradeLink: z.string().nullable().default(null),
        email: z.string().nullable().default(null),
    });

    constructor() {
        super({
            path: '/:profileId',
        });
    }

    run() {
        this.router.post('/', async (req,res)=>{
            const ownerId = req.jwt.userId
            const profileId = (req.params as any).profileId as string
            const body = this.bodyValidator.safeParse(req.body);
            if (!body.success)
                throw new ErrorMaker({
                    type: 'form_validation',
                    errors: body.error.errors
                });
        })
    }
}