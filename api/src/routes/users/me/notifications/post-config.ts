import { RouteBase } from '../../../../base/Route';
import { AuthMiddleware } from '../../../../middlewares/auth';
import { ErrorMaker, ErrorToResponse } from '../../../../libs/ErrorMaker';
import { z } from 'zod';

export default class NotificationsPostRoute extends RouteBase {
    bodyValidator = z.object({
        enableRedemptions: z.boolean(),
        enableWhispers: z.boolean(),
        telegramUsername: z.string().nullable().default(null),
    });

    constructor() {
        super({
            path: '/',
        });
    }

    run() {
        this.router.post('/', async (req,res)=>{
            try{
                const body = this.bodyValidator.safeParse(req.body);
                if (!body.success)
                    throw new ErrorMaker({
                        type: 'form_validation',
                        errors: body.error.errors
                    });

               await this.dd.notifications.updateUserSettings(req.jwt.userId, {
                    enableRedemptions: body.data.enableRedemptions? 1:0,
                    enableWhispers: body.data.enableWhispers? 1:0,
                    telegramUsername: body.data.telegramUsername
                })

                res.json({ success:true })
            }catch(e:any){
                console.error(e)
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        })
    }
}