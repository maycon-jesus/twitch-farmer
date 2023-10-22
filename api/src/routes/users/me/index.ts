import { RouteBase } from '../../../base/Route';
import { AuthMiddleware } from '../../../middlewares/auth';
import { UsersMeGetInfoRoute } from './getInfo';
import RedemptionsRoute from './redemptions';
import NotificationsRoute from './notifications';

export class UsersMeRoute extends RouteBase {
    constructor() {
        super({
            path: '/me',
            middlewares: [new AuthMiddleware()],
            childs: [new UsersMeGetInfoRoute(), new RedemptionsRoute(), new NotificationsRoute()],
        });
    }
}
