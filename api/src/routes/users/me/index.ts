import { RouteBase } from '../../../base/Route';
import { AuthMiddleware } from '../../../middlewares/auth';
import { UsersMeGetInfoRoute } from './getInfo';
import RedemptionsRoute from './redemptions';
import { UsersMeConfigRoute } from './config';

export class UsersMeRoute extends RouteBase {
    constructor() {
        super({
            path: '/me',
            middlewares: [new AuthMiddleware()],
            childs: [new UsersMeGetInfoRoute(), new RedemptionsRoute(), new UsersMeConfigRoute()],
        });
    }
}
