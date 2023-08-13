import { RouteBase } from '../../base/Route';
import RouteAddItem from './add-item';
import { AuthMiddleware } from '../../middlewares/auth';


export default class RedemptionsBotRoute extends RouteBase {
    constructor() {
        super({
            path: '/redemptions-bot',
            middlewares: [new AuthMiddleware()],
            childs: [new RouteAddItem()]
        });
    }
}