import cron from 'cron';
import { ServiceBase } from '../base/Service';
import { ErrorMaker } from '../libs/ErrorMaker';

export class TwitchRefreshTokensService extends ServiceBase {
    private cron: cron.CronJob;

    constructor() {
        super();
        this.cron = new cron.CronJob('0 * * * * *', this.refreshTokens, null, true, undefined, this);
    }

    async refreshTokens() {
        try {
            const accounts = await this.dd.twitchAccounts.listAccounts({
                orderBy: 'tokenExpiresAt',
                sort: 'desc',
                limit: 10,
                filters: {
                    tokenExpiresIn: {
                        minute: 10,
                    },
                },
            });
            for (const account of accounts) {
                try {
                    const nTokens = await this.dd.twitchApi.refreshToken(account.refreshToken);
                    await this.dd.twitchAccounts.setTwitchTokens(
                        account.id,
                        nTokens.accessToken,
                        nTokens.refreshToken,
                        nTokens.expiresAt
                    );
                    await this.dd.services.twitchBot.changeAccountToken(account.id, nTokens.accessToken);
                } catch (err) {
                    console.error(err);
                    if (err instanceof ErrorMaker && err.type === 'unauthorized') {
                        await this.dd.twitchAccounts.setTokenInvalid(account.id);
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
}
