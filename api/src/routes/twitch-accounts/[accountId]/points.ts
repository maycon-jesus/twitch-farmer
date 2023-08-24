import { RouteBase } from '../../../base/Route';
import { ErrorToResponse } from '../../../libs/ErrorMaker';

export default class PointsRoute extends RouteBase {
    constructor() {
        super({
            path: '/points'
        });
    }

    run() {
        this.router.get('/', async (req, res) => {
            try {
                const params: any = req.params;
                const channels = await this.dd.twitchChannels.listChannels({
                    ownerId: req.jwt.userId
                })

                const channelsPoints:Record<string, {points:number,rank:number}> = {}
                for(const channel of channels){
                    const points = await this.dd.streamElementsPoints.getAccountChannelPoints(params.accountId, channel.id)
                    channelsPoints[channel.id]=points
                }

                res.json(channelsPoints);
            } catch (e: any) {
                console.log(e)
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}
