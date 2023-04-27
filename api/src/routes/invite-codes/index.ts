import { RouteBase } from '../../base/Route';
import { AuthMiddleware } from '../../middlewares/auth';
import { HasPermissionsMiddleware } from '../../middlewares/hasPermissions';
import { InviteCodesGenerateRoute } from './generate-invite-code';
import { InviteCodesListRoute } from './list-invites';

export class InviteCodesRoute extends RouteBase {
    constructor() {
        super({
            path: '/invite-codes',
            middlewares: [new AuthMiddleware(), new HasPermissionsMiddleware(['GENERATE_INVITE_CODE'])],
            childs: [new InviteCodesGenerateRoute(), new InviteCodesListRoute()],
        });
    }
    run(): void {}
}
