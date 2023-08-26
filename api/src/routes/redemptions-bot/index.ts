import { RouteBase } from '../../base/Route';
import RouteAddItem from './add-item';
import { AuthMiddleware } from '../../middlewares/auth';
import RouteListMyItems from './list-my-item';
import RouteDeleteItem from './delete-item';
import DataProfilesRoute from './data-profiles';


export default class RedemptionsBotRoute extends RouteBase {
    constructor() {
        super({
            path: '/redemptions-bot',
            middlewares: [new AuthMiddleware()],
            childs: [new RouteAddItem(), new RouteListMyItems(), new RouteDeleteItem(), new DataProfilesRoute()]
        });
    }
}