import { RouteBase } from '../../../base/Route';
import { ErrorToResponse } from '../../../libs/ErrorMaker';

export class DeleteTwitchChannelRoute extends RouteBase {
    run() {
        this.router.delete('/', async (req, res) => {
            try {
                const params = req.params as any;
                await this.dd.twitchChannels.removeChannel(params.channelId);
                res.json({ success: true });
            } catch (e: any) {
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}