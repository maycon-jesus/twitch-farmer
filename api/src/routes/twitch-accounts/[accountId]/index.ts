import { RouteBase } from '../../../base/Route';
import UpdateStreamelementsTokenRoute from './update-streamelements-token';
import GetAccountDetailsRoute from './get-account-details';
import AccountDeleteRoute from './delete';
import { TwitchAccountsMiddleware } from '../../../middlewares/twitchAccount';
import PointsRoute from './points';

export default class AccountIdRoute extends RouteBase {
    constructor() {
        super({
            path: '/:accountId',
            childs: [new UpdateStreamelementsTokenRoute(), new GetAccountDetailsRoute(), new AccountDeleteRoute(), new PointsRoute()],
            middlewares: [new TwitchAccountsMiddleware()],
        });
    }
}
