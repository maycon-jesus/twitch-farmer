import { RouteBase } from '../../../base/Route';
import { DeleteTwitchChannelRoute } from './delete-channel';

export class TwitchChannelRoute extends RouteBase {
    constructor() {
        super({
            path: '/:channelId',
            childs: [new DeleteTwitchChannelRoute()]
        });
    }

    run() {
    }
}