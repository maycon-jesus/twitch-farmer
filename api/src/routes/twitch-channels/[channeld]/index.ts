import { RouteBase } from '../../../base/Route';
import { DeleteTwitchChannelRoute } from './delete-channel';
import { TwitchChannelsMiddleware } from '../../../middlewares/twitchChannels';

export class TwitchChannelRoute extends RouteBase {
    constructor() {
        super({
            path: '/:channelId',
            childs: [new DeleteTwitchChannelRoute()],
            middlewares: [new TwitchChannelsMiddleware()],
        });
    }

    run() {}
}
