import { RouteBase } from '../../base/Route';
import { z } from 'zod';
import { ErrorMaker, ErrorToResponse } from '../../libs/ErrorMaker';


export default class RouteListMyItems extends RouteBase {
    bodyValidator = z.object({
        channelId: z.string().nonempty('Informe o canal'),
        itemId: z.string().nonempty('Informe o item'),
        accountId: z.string().nonempty('Informe a conta'),
        inputs: z.string().array().default([])
    });

    constructor() {
        super({
            path: '/list-my-items',
            childs: []
        });
    }

    run() {
        this.router.get('/', async (req, res) => {
            try {
                const items: any[] = await this.dd.streamElementsRedemptionsQueue.listItemsFromQueue({
                    ownerId: req.jwt.userId,
                    completed: false,
                    order: {
                        by: 'createdAt',
                        sort: 'desc'
                    }
                });
                for(const item of items){
                    const channel = await this.dd.twitchChannels.getChannel(item.channelId)
                    item.channel = {
                        id: channel.id,
                        login: channel.login,
                        displayName: channel.displayName,
                        profileImageUrl: channel.profileImageUrl
                    }
                    const account = await this.dd.twitchAccounts.getAccountById(item.accountId)
                    item.account = {
                        id: account.id,
                        login: account.login,
                        displayName: account.displayName,
                        profileImageUrl: account.profileImageUrl
                    }
                    item.inputs = JSON.parse(item.inputs)
                    const it = await this.dd.streamElementsItems.getItem(item.itemId)
                    if(!it) throw new ErrorMaker({
                        type: 'not_found',
                        errors: [{message: 'Item não encontrado!'}]
                    })
                    item.item = {
                        name: it.name,
                        cost: it.cost,
                        subscriberOnly: it.subscriberOnly
                    }

                    const queuePosition = await this.dd.streamElementsRedemptionsQueue.getItemQueuePosition(item.itemId,item.id)
                    item.queuePosition = queuePosition
                }
                res.json(items);
            } catch (e: any) {
                console.log(e);
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}