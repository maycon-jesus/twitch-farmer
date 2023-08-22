import { RouteBase } from '../../../../base/Route';
import { Route } from './ntfy-topic-name';

export class UsersMeConfigRoute extends RouteBase {
    constructor() {
        super({
            path: '/config',
            middlewares: [],
            childs: [new Route()],
        });
    }
}
