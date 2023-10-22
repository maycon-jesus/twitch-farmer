import { ServiceBase } from '../base/Service';
import cron from 'cron';

export class StreamElementsJwtChecker extends ServiceBase{
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
            filters: {
                hasStreamElementsToken: true
            }
        });

        for (const account of accounts) {
            const tokenValid = await this.dd.streamElementsApi.validateToken(account.streamElementsToken)
            if(!tokenValid.valid) {
                await this.dd.twitchAccounts.setStreamElementsToken(account.id, '');
                await this.dd.streamElementsRedemptionsQueue.setAllItemsQueueSuspended(true, {
                    accountId: account.id
                })
            }
        }

        if (accounts.length > 0) {
            this.actualPage++;
        } else {
            this.actualPage = 1;
        }
    }
}