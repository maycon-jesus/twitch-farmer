import { RouteBase } from '../../../base/Route';
import { DeleteTwitchChannelRoute } from './delete-channel';
import { TwitchChannelsMiddleware } from '../../../middlewares/twitchChannels';
import AccountIdRoute from './[accountId]';
import StoreRoute from './store';
import GetChannelRoute from './get-channel';

export class TwitchChannelRoute extends RouteBase {
    constructor() {
        super({
            path: '/:channelId',
            childs: [new DeleteTwitchChannelRoute(), new GetChannelRoute(), new StoreRoute(), new AccountIdRoute()],
            middlewares: [new TwitchChannelsMiddleware()],
        });
    }
}
