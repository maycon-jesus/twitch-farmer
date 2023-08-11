import { RouteBase } from '../../../../base/Route';
import { TwitchAccountsMiddleware } from '../../../../middlewares/twitchAccount';
import PointsRoute from './points';
import RedemptionsItemRoute from './redemptions/[itemId]/index'

export default class Route extends RouteBase {
    constructor() {
        super({
            path: '/:accountId',
            middlewares: [new TwitchAccountsMiddleware()],
            childs: [new PointsRoute(), new RedemptionsItemRoute()],
        });
    }
}
