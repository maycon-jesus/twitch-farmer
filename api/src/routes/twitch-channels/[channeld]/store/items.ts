import { RouteBase } from '../../../../base/Route';
import { ErrorToResponse } from '../../../../libs/ErrorMaker';

export default class ItemsRoute extends RouteBase {
    constructor() {
        super({
            path: '/items',
        });
    }

    run() {
        this.router.get('/', async (req, res) => {
            try {
                const params = req.params as any;
                const channel = await this.dd.twitchChannels.getChannel(params.channelId);
                const items:any[] = await this.dd.streamElementsItems.getChannelItems({
                    streamElementsUserId: channel.streamElementsUserId,
                    hideDeleted: req.query.hideDeleted === "true"
                });

                for(const item of items){
                    const queueSize = await this.dd.streamElementsRedemptionsQueue.getStreamElementsItemQueueSize(item.id)
                    item.queueSize = queueSize
                }

                res.json(items);
            } catch (e: any) {
                console.log(e)
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}
