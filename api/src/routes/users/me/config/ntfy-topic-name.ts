import { RouteBase } from '../../../../base/Route';
import { ErrorMaker, ErrorToResponse } from '../../../../libs/ErrorMaker';
import { z } from 'zod';

export class Route extends RouteBase {
    bodyValidator = z.object({
        ntfyTopicName: z.string().nonempty('Informe o nome do canal de notificações!')
    })
    constructor() {
        super({
            path: '/ntfy-topic-name'
        });
    }

    run() {
        this.router.post('/', async(req,res)=>{
            try {
                const body = this.bodyValidator.safeParse(req.body)
                if(!body.success) throw new ErrorMaker({
                    type: 'form_validation',
                    errors: body.error.errors
                })
                await this.dd.users.setNtfyTopicName(req.jwt.userId, body.data.ntfyTopicName)
                res.json({success:true})
            } catch (err: any) {
                const e = ErrorToResponse(err);
                res.status(e.status).json(e.error);
            }
        })
    }
}