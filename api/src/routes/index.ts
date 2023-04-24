import { RouteBase } from '../base/Route';
import { AuthRoutes } from './auth';
import { InviteCodesRoute } from './invite-codes';
import { UsersRoute } from './users';

export class Routes extends RouteBase {
    constructor() {
        super({
            path: '/',
            childs: [new AuthRoutes(), new UsersRoute(), new InviteCodesRoute()],
        });
    }

    run(): void {}
}
