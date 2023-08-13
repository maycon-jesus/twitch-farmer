import { RouteBase } from '../../../base/Route';

export default class Route extends RouteBase {
    constructor() {
        super({
            path: '/accounts-points',
        });
    }

    run() {
        this.router.get('/', async (req, res) => {
            const params = req.params as any;
            const ownerAccounts= await this.dd.twitchAccounts.listAccounts({
                ownerId: req.jwt.userId
            })

            const pointsList:Record<string, number> = {}
            for(const account of ownerAccounts){
            const { points } = await this.dd.streamElementsPoints.getAccountChannelPoints(
                account.id,
                params.channelId
            );
                pointsList[account.id]=points
            }
            res.json(pointsList);
        });
    }
}
