import { RouteBase } from '../../../base/Route';
import { ErrorToResponse } from '../../../libs/ErrorMaker';

export default class AccountDeleteRoute extends RouteBase {
    constructor() {
        super();
    }

    run() {
        this.router.delete('/', async(req,res)=>{
            try{
                const params = req.params as any
                await this.dd.twitchAccounts.deleteAccount(params.accountId)
                res.json({success:true})
            }catch(e:any){
                const err=  ErrorToResponse(e)
                res.status(err.status).json(err.error)
            }
        })
    }
}