import { ServiceBase } from '../base/Service';
import cron from 'cron';
import { TwitchAccount } from '../controllers/TwitchAccounts';
import { DateTime } from 'luxon';

export class StreamElementsRedemptionsUpdater extends ServiceBase {
    actualPage = 0;
    private cron: cron.CronJob;

    constructor() {
        super();
        this.cron = new cron.CronJob('0/15 * * * * *', this.loadAccounts, null, true, undefined, this);
    }

    async loadAccounts() {
        try {
            const accounts = await this.dd.twitchAccounts.listAccounts({
                offset: this.actualPage,
                limit: 1,
                filters: {
                    hasStreamElementsToken: true
                }
            });

            for (const account of accounts) {
                await this.loadRedemptions(account);
            }

            if (accounts.length > 0) {
                this.actualPage++;
            } else {
                this.actualPage = 0;
            }

        } catch (e) {
            console.error(e);
        }
    }

    async loadRedemptions(account: TwitchAccount) {
        const channels = await this.dd.twitchChannels.listChannels({
            ownerId: account.ownerId
        });

        const redemptions = await this.dd.streamElementsApi.getUserRedemptions(account.streamElementsUserId, account.streamElementsToken);
        for (const redemption of redemptions) {
            const channel = channels.find(c => c.streamElementsUserId === redemption.channel._id);
            if (!channel) continue;
            if (redemption.item?._id) {
                const itemExistOnDb = await this.dd.streamElementsItems.getItem(redemption.item?._id!);
                if (!itemExistOnDb) continue;
            }

            await this.dd.streamElementsRedemptions.setRedemption({
                id: redemption._id,
                inputs: redemption.input,
                ownerId: account.ownerId,
                channelId: channel.id,
                itemId: redemption.item?._id || null,
                updatedAt: DateTime.fromISO(redemption.updatedAt).toISO()!,
                accessCode: redemption.accessCode || null,
                accountId: account.id,
                completed: redemption.completed ? 1 : 0,
                createdAt: DateTime.fromISO(redemption.createdAt).toISO()!,
                rejected: redemption.rejected ? 1 : 0
            });
        }
    }
}