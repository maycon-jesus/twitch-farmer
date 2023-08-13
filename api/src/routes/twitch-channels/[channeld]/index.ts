import { RouteBase } from '../../../base/Route';
import { DeleteTwitchChannelRoute } from './delete-channel';
import { TwitchChannelsMiddleware } from '../../../middlewares/twitchChannels';
import AccountIdRoute from './[accountId]';
import StoreRoute from './store';
import GetChannelRoute from './get-channel';
import AccountsPoints from './accounts-points'

export class TwitchChannelRoute extends RouteBase {
    constructor() {
        super({
            path: '/:channelId',
            childs: [new DeleteTwitchChannelRoute(), new GetChannelRoute(), new StoreRoute(), new AccountsPoints(), new AccountIdRoute()],
            middlewares: [new TwitchChannelsMiddleware()],
        });
    }
}
