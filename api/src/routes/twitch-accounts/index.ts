import {RouteBase} from '../../base/Route';
import {AuthMiddleware} from '../../middlewares/auth';
import GetAddAccountLinkRoute from './get-add-account-link';
import ListAccounts from './list-accounts';
import AccountIdRoute from "./[accountId]";

export class TwitchAccountsRoutes extends RouteBase {
    constructor() {
        super({
            path: '/twitch-accounts',
            middlewares: [new AuthMiddleware()],
            childs: [new GetAddAccountLinkRoute(), new ListAccounts(), new AccountIdRoute()],
        });
    }

    run(): void {
    }
}
