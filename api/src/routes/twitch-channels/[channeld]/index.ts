import { RouteBase } from '../../../base/Route';
import { DeleteTwitchChannelRoute } from './delete-channel';
import { TwitchChannelsMiddleware } from '../../../middlewares/twitchChannels';
import AccountIdRoute from './[accountId]';

export class TwitchChannelRoute extends RouteBase {
    constructor() {
        super({
            path: '/:channelId',
            childs: [new DeleteTwitchChannelRoute(), new AccountIdRoute()],
            middlewares: [new TwitchChannelsMiddleware()],
        });
    }
}
