import { RouteBase } from '../../base/Route';
import { z } from 'zod';
import { ErrorMaker, ErrorToResponse } from '../../libs/ErrorMaker';


export default class RouteDeleteItem extends RouteBase {
    bodyValidator = z.object({
        channelId: z.string().nonempty('Informe o canal'),
        itemId: z.string().nonempty('Informe o item'),
        accountId: z.string().nonempty('Informe a conta'),
        inputs: z.string().array().default([])
    });

    constructor() {
        super({
            path: '/items/:itemId',
            childs: []
        });
    }

    run() {
        this.router.delete('/', async (req, res) => {
            try {
                const itemId = (req.params as any).itemId as any
                const item = await this.dd.streamElementsRedemptionsQueue.getItemFromQueue({
                    id: itemId
                })
                if(!item) throw new ErrorMaker({
                    type: 'not_found',
                    errors: [{message: 'Registro não encontrado'}]
                })
                if(item.ownerId !== req.jwt.userId) throw new ErrorMaker({
                    type: 'forbidden',
                    errors: [{message: 'Você não possui acesso para isso'}]
                })
                await this.dd.streamElementsRedemptionsQueue.deleteItem(itemId);
                res.json({ success: true });
            } catch (e: any) {
                console.log(e);
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}