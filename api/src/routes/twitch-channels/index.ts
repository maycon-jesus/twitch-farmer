import { RouteBase } from '../../base/Route';
import { AddTwitchChannelRoute } from './add-channel';
import { ListTwitchChannelsRoute } from './list-channels';
import { TwitchChannelRoute } from './[channeld]';
import { AuthMiddleware } from '../../middlewares/auth';

export class TwitchChannelsRoute extends RouteBase {
    constructor() {
        super({
            path: '/twitch-channels',
            middlewares: [new AuthMiddleware()],
            childs: [new AddTwitchChannelRoute(), new ListTwitchChannelsRoute(), new TwitchChannelRoute()]
        });
    }

    run() {
    }
}