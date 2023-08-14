import { RouteBase } from '../../base/Route';
import { z } from 'zod';
import { ErrorMaker, ErrorToResponse } from '../../libs/ErrorMaker';


export default class RouteAddItem extends RouteBase {
    bodyValidator = z.object({
        channelId: z.string().nonempty('Informe o canal'),
        itemId: z.string().nonempty('Informe o item'),
        accountId: z.string().nonempty('Informe a conta'),
        inputs: z.string().array().default([])
    });

    constructor() {
        super({
            path: '/add-item',
            childs: []
        });
    }

    run() {
        this.router.post('/', async (req, res) => {
            try {
                const rolePermissions = await this.dd.roles.getRolePermissions(req.jwt.roleId);
                const body = this.bodyValidator.safeParse(req.body);
                if (!body.success)
                    throw new ErrorMaker({
                        type: 'form_validation',
                        errors: body.error.errors
                    });
                const account = await this.dd.twitchAccounts.getAccountById(body.data.accountId)
                if(!account.streamElementsToken)throw new ErrorMaker({
                    type: 'unprocessable_entity',
                    errors: [{message:'Essa conta não possui token do StreamElements definido!'}]
                });

                await this.dd.streamElementsRedemptionsQueue.addItemToQueue(req.jwt.userId, body.data.accountId, body.data.channelId, body.data.itemId, body.data.inputs, rolePermissions.REDEMPTIONS_BOT_PRIORITY);
                res.json({ success: true });
            } catch (e: any) {
                console.log(e);
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}