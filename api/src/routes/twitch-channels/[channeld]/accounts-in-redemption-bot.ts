import { RouteBase } from '../../../base/Route';
import { DateTime } from 'luxon';
import { ErrorMaker } from '../../../libs/ErrorMaker';

export default class AccountsInRedemptionBotRoute extends RouteBase {
    constructor() {
        super({
            path: '/accounts-in-redemption-bot'
        });
    }

    run() {
        this.router.get('/', async (req, res) => {
            const params = req.params as any;
            const ownerAccounts = await this.dd.twitchAccounts.listAccounts({
                ownerId: req.jwt.userId
            });

            const accountsList: Record<string, boolean> = {};
            for (const account of ownerAccounts) {
                const itemInQueue = await this.dd.streamElementsRedemptionsQueue.getItemFromQueue({
                    accountId: account.id,
                    channelId: params.channelId,
                    completed: false
                })
                if(!itemInQueue){
                    accountsList[account.id]=false
                }else{
                    accountsList[account.id]=true
                }
            }
            res.json(accountsList);
        });
    }
}
