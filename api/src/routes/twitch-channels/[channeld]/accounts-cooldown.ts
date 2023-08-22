import { RouteBase } from '../../../base/Route';
import { DateTime } from 'luxon';
import { ErrorMaker } from '../../../libs/ErrorMaker';

export default class Route extends RouteBase {
    constructor() {
        super({
            path: '/accounts-cooldown'
        });
    }

    run() {
        this.router.get('/', async (req, res) => {
            const params = req.params as any;
            const ownerAccounts = await this.dd.twitchAccounts.listAccounts({
                ownerId: req.jwt.userId
            });

            const datesList: Record<string, number> = {};
            for (const account of ownerAccounts) {
                const redemptions = await this.dd.streamElementsRedemptions.listRedemptions({
                    accountId: account.id,
                    channelId: params.channelId,
                    order: {
                        by: 'createdAt',
                        sort: 'desc'
                    },
                    pagination: {
                        limit: 1,
                        page: 1
                    }
                });
                if (!redemptions.length || !redemptions[0].itemId) {
                    datesList[account.id] = 0;
                    continue;
                }
                const item = await this.dd.streamElementsItems.getItem(redemptions[0].itemId);
                if (!item) throw new ErrorMaker({
                    type: 'not_found',
                    errors: [{ message: `Item ${redemptions[0].itemId} não encontrado!` }]
                });

                const redemptionDateTime = DateTime.fromJSDate(redemptions[0].createdAt).toMillis();

                let cooldowns: number[] = [];

                if (item.cooldownUser) {
                    const cooldownUserEnd = redemptionDateTime + item.cooldownUser * 1000;
                    if (cooldownUserEnd > Date.now()) {
                        cooldowns.push(cooldownUserEnd - Date.now());
                    }
                }

                if (item.cooldownCategory) {
                    const cooldownCategoryEnd = redemptionDateTime + item.cooldownCategory * 1000;
                    if (cooldownCategoryEnd > Date.now()) {
                        cooldowns.push(cooldownCategoryEnd - Date.now());
                    }
                }

                cooldowns = cooldowns.sort((a, b) => b - a);

                if (cooldowns.length > 0) {
                    datesList[account.id] = cooldowns[0];
                } else {
                    datesList[account.id] = 0;
                }

            }
            res.json(datesList);
        });
    }
}
