import { RouteBase } from '../../../base/Route';

export default class Route extends RouteBase {
    constructor() {
        super({
            path: '/accounts-ranks'
        });
    }

    run() {
        this.router.get('/', async (req, res) => {
            const params = req.params as any;
            const ownerAccounts = await this.dd.twitchAccounts.listAccounts({
                ownerId: req.jwt.userId
            });

            const ranksList: Record<string, number> = {};
            for (const account of ownerAccounts) {
                const { rank } = await this.dd.streamElementsPoints.getAccountChannelPoints(
                    account.id,
                    params.channelId
                );
                ranksList[account.id] = rank;
            }
            res.json(ranksList);
        });
    }
}
