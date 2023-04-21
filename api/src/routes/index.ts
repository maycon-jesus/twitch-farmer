import { RouteBase } from '../base/Route';
import { AuthRoutes } from './auth';
import { UsersRoute } from './users';

export class Routes extends RouteBase {
    constructor() {
        super({
            path: '/',
            childs: [new AuthRoutes(), new UsersRoute()],
        });
    }

    run(): void {}
}
