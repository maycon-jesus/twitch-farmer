import { RouteBase } from '../../base/Route';
import RouteRedemptionsQueue from './redemptions-queue';
import RouteRedemptionsQueueStatus from './redemptions-queue-status';

export default class ServiceRoute extends RouteBase {
    constructor() {
        super({
            path: '/service',
            childs: [new RouteRedemptionsQueue(), new RouteRedemptionsQueueStatus()]
        });
    }
}