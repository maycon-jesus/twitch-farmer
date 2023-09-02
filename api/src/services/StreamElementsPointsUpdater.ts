import { ServiceBase } from '../base/Service';
import cron from 'cron';
import { TwitchAccount } from '../controllers/TwitchAccounts';
import { waitTime } from '../utils/waitTime';

export class StreamElementsPointsUpdaterService extends ServiceBase {
    actualPage = 1;
    private cron: cron.CronJob;

    constructor() {
        super();
        this.cron = new cron.CronJob('0 * * * * *', this.loadAccounts, null, true, undefined, this);
    }

    async loadAccounts() {
        const accounts = await this.dd.twitchAccounts.listAccounts({
            limit: 1,
            offset: this.actualPage - 1,
        });

        for (const account of accounts) {
            await this.updateAccountPoints(account);
        }

        if (accounts.length > 0) {
            this.actualPage++;
        } else {
            this.actualPage = 1;
        }
    }

    async updateAccountPoints(account: TwitchAccount) {
        try {
            const channels = await this.dd.twitchChannels.listChannels({
                ownerId: account.ownerId,
            });

            for (const channel of channels) {
                const points = await this.dd.streamElementsApi.getChannelUserPoints(
                    channel.streamElementsUserId,
                    account.login
                );
                await this.dd.streamElementsPoints.updatePoints(account.id, channel.id, points.points, points.rank);
                await waitTime(1000)
            }
        } catch (e) {
            console.error(e);
        }
    }
}
