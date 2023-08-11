import { RouteBase } from '../../../../base/Route';

export default class Route extends RouteBase {
    constructor() {
        super({
            path: '/points',
        });
    }

    run() {
        this.router.get('/', async (req, res) => {
            const params = req.params as any;
            const { points } = await this.dd.streamElementsPoints.getAccountChannelPoints(
                params.accountId,
                params.channelId
            );
            res.json({
                points,
            });
        });
    }
}
