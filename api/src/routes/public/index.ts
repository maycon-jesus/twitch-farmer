import {RouteBase} from '../../base/Route';
import AddTwitchAccount from './add-account';

export class PublicRoutes extends RouteBase {
    constructor() {
        super({
            path: '/public',
            childs: [new AddTwitchAccount()],
        });
    }

    run(): void {
    }
}
