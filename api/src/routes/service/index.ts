import { RouteBase } from '../../base/Route';
import RouteRedemptionsQueue from './redemptions-queue';
import RouteRedemptionsQueueStatus from './redemptions-queue-status';
import ProxysPingQueue from './proxys-ping';

export default class ServiceRoute extends RouteBase {
    constructor() {
        super({
            path: '/service',
            childs: [new RouteRedemptionsQueue(), new RouteRedemptionsQueueStatus(), new ProxysPingQueue()]
        });
    }
}