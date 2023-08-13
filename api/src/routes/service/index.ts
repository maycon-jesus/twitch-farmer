import { RouteBase } from '../../base/Route';
import RouteRedemptionsQueue from './redemptions-queue';

export default class ServiceRoute extends RouteBase {
    constructor() {
        super({
            path: '/service',
            childs: [new RouteRedemptionsQueue()]
        });
    }
}