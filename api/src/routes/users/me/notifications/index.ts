import { RouteBase } from '../../../../base/Route';
import { AuthMiddleware } from '../../../../middlewares/auth';
import NotificationsGetRoute from './get-config';
import NotificationsPostRoute from './post-config';

export default class NotificationsRoute extends RouteBase {
    constructor() {
        super({
            path: '/notifications',
            middlewares: [new AuthMiddleware()],
            childs: [new NotificationsGetRoute(), new NotificationsPostRoute()]
        });
    }
}