import { RouteBase } from '../../../base/Route';
import { AuthMiddleware } from '../../../middlewares/auth';
import { UsersMeGetInfoRoute } from './getInfo';

export class UsersMeRoute extends RouteBase {
    constructor() {
        super({
            path: '/me',
            middlewares: [new AuthMiddleware()],
            childs: [new UsersMeGetInfoRoute()],
        });
    }

    run(): void {}
}
