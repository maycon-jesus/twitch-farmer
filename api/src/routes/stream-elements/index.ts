import { RouteBase } from '../../base/Route';
import { StreamElementsChannelIdRoute } from './[channelId]';

export class StreamElementsRoute extends RouteBase {
    constructor() {
        super({
            path: '/stream-elements',
            childs: [new StreamElementsChannelIdRoute()],
        });
    }
}
