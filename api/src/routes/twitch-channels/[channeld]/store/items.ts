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
                const items = await this.dd.streamElementsItems.getChannelItems({
                    streamElementsUserId: channel.streamElementsUserId,
                });
                res.json(items);
            } catch (e: any) {
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}
