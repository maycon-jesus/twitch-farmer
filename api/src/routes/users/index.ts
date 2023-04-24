import { RouteBase } from '../../base/Route';
import { UsersMeRoute } from './me';

export class UsersRoute extends RouteBase {
    constructor() {
        super({
            path: '/users',
            childs: [new UsersMeRoute()],
        });
    }

    run(): void {}
}
