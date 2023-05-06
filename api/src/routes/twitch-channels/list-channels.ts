import { RouteBase } from '../../base/Route';
import { ErrorToResponse } from '../../libs/ErrorMaker';

export class ListTwitchChannelsRoute extends RouteBase {
    run() {
        this.router.get('/', async (req, res) => {
            try {
                const channels = await this.dd.twitchChannels.listChannels(req.jwt.userId);
                res.json(channels);
            } catch (e: any) {
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}