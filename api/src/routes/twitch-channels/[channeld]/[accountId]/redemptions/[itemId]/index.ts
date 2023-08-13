import { RouteBase } from '../../../../../../base/Route';
import { ErrorMaker, ErrorToResponse } from '../../../../../../libs/ErrorMaker';
import { z } from 'zod';

export default class Route extends RouteBase {
    private validators = z.object({
        input: z.string().array(),
        message: z.string().trim().optional()
    })
    constructor() {
        super({
            path: '/redemptions/:itemId'
        });
    }

    run() {
        this.router.post('/', async (req,res)=>{
            try{
                const params = req.params as any
                const channel =await this.dd.twitchChannels.getChannel(params.channelId)
                const account =await this.dd.twitchAccounts.getAccountById(params.accountId)
                const accountPoints = await this.dd.streamElementsPoints.getAccountChannelPoints(account.id, channel.id)
                const storeItem = await this.dd.streamElementsItems.getItem(params.itemId)
                if(!storeItem) throw new ErrorMaker({
                    type: 'not_found',
                    errors: [{message: 'Item não encontrado!'}]
                })
                if(!account.streamElementsToken)  throw new ErrorMaker({
                    type: 'default',
                    errors:[{message: 'Conta não possui token do StreamElements configurado!'}]
                })

                const body = this.validators.safeParse(req.body)
                if (!body.success)
                    throw new ErrorMaker({
                        type: 'form_validation',
                        errors: body.error.errors,
                    });
                if(!body.data.message && storeItem.allowMessages) throw new ErrorMaker({
                    type: 'default',
                    errors:[{message: 'Informe uma mensagem para ser enviada!'}]
                })
                if(accountPoints.points<storeItem.cost)  throw new ErrorMaker({
                    type: 'default',
                    errors:[{message: 'Conta não possui pontos suficientes!'}]
                })
                const r = await this.dd.streamElementsApi.redemption(channel.streamElementsUserId, storeItem.id, body.data.input, body.data.message||null, account.streamElementsToken)
                res.json({
                    accessCode: r.accessCode
                })
            }catch(e:any){
                const err = ErrorToResponse(e)
                res.status(err.status).json(err.error)
            }
        })
    }
}