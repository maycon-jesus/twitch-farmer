import { RouteBase } from '../base/Route';
import { AuthRoutes } from './auth';
import { InviteCodesRoute } from './invite-codes';
import { PublicRoutes } from './public';
import { TwitchAccountsRoutes } from './twitch-accounts';
import { UsersRoute } from './users';
import { TwitchChannelsRoute } from './twitch-channels';

export class Routes extends RouteBase {
    constructor() {
        super({
            path: '/',
            childs: [
                new AuthRoutes(),
                new UsersRoute(),
                new InviteCodesRoute(),
                new PublicRoutes(),
                new TwitchAccountsRoutes(),
                new TwitchChannelsRoute(),
            ],
        });
    }
}
