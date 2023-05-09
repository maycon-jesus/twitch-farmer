import { RouteBase } from '../../../base/Route';
import { StreamElementsAccountIdRoute } from './[accountId]';

export class StreamElementsChannelIdRoute extends RouteBase {
    constructor() {
        super({
            path: '/:channelId',
            childs: [new StreamElementsAccountIdRoute()],
        });
    }
}
