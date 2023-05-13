import { RouteBase } from '../../../base/Route';
import { ErrorToResponse } from '../../../libs/ErrorMaker';

export default class GetChannelRoute extends RouteBase {
    run() {
        this.router.get('/', async (req, res) => {
            try {
                const params = req.params as any;
                const channel = await this.dd.twitchChannels.getChannel(params.channelId);
                res.json(channel);
            } catch (e: any) {
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}
