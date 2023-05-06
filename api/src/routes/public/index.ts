import { RouteBase } from '../../base/Route';
import AddTwitchAccount from './add-account';
import { PublicRegister } from './register';

export class PublicRoutes extends RouteBase {
    constructor() {
        super({
            path: '/public',
            childs: [new AddTwitchAccount(), new PublicRegister()],
        });
    }
}
