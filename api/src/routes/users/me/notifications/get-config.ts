import { RouteBase } from '../../../../base/Route';
import { AuthMiddleware } from '../../../../middlewares/auth';
import { ErrorToResponse } from '../../../../libs/ErrorMaker';

export default class NotificationsGetRoute extends RouteBase {
    constructor() {
        super({
            path: '/',
        });
    }

    run() {
        this.router.get('/', async (req,res)=>{
            try{
                const settings = await this.dd.notifications.getUserSettings(req.jwt.userId)
                settings.enableRedemptions
                res.json(settings)
            }catch(e:any){
                console.error(e)
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        })
    }
}