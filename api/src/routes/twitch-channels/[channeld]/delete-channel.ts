import { RouteBase } from '../../../base/Route';
import { ErrorToResponse } from '../../../libs/ErrorMaker';

export class DeleteTwitchChannelRoute extends RouteBase {
    run() {
        this.router.delete('/', async (req, res) => {
            try {
                const params = req.params as any;
                const channel = await this.dd.twitchChannels.getChannel(params.channelId);
                await this.dd.twitchChannels.removeChannel(params.channelId);
                await this.dd.services.twitchBot.leaveChannelForUserAccounts(req.jwt.userId, channel.login);
                res.json({ success: true });
            } catch (e: any) {
                console.log(e)
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}
