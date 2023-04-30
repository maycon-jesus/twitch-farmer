import {ControllerBase} from '../base/Controller';
import {v4} from 'uuid';
import {ErrorMaker} from '../libs/ErrorMaker';

export class TwitchAccountsController extends ControllerBase {
    async getAuthorizationUrl(ownerId: string) {
        const code = v4();
        await this.dd.database.db('pre_twitch_account').insert({
            code,
            ownerId,
        });

        const baseUrl = 'https://id.twitch.tv/oauth2/authorize';
        const query = `response_type=code&client_id=${process.env.TWITCH_BOT_CLIENT_ID}&redirect_uri=${process.env.FRONTEND_URL}&scope=chat:edit chat:read whispers:read whispers:edit user:read:email&state=${code}&force_verify=true`;
        return baseUrl + '?' + query;
    }

    async getOwnerByPreAccountCode(code: string): Promise<string> {
        const preTwitchAccount = await this.dd.database
            .db('pre_twitch_account')
            .select('ownerId')
            .where({
                code,
            })
            .first();
        if (!preTwitchAccount)
            throw new ErrorMaker({
                type: 'not_found',
                errors: [{message: 'Não foi possivel encontrar à qual conta você esta tentando adicionar'}],
            });
        return preTwitchAccount.ownerId;
    }

    async getAccountByUserId(userId: string) {
        return this.dd.database.db('twitch_accounts').where({userId: userId}).first();
    }

    async getAccountById(id: string) {
        return this.dd.database.db('twitch_accounts').where({id}).first();
    }

    async insert(code: string, identifyCode: string, redirectUrl: string) {
        const ownerId = await this.getOwnerByPreAccountCode(identifyCode);
        const tokens = await this.dd.twitchApi.codeToToken(code, redirectUrl);
        const validationToken = await this.dd.twitchApi.validateToken(tokens.accessToken);
        const accountDetails = await this.dd.twitchApi.getAccountDetails(validationToken.userId, {
            accessToken: tokens.accessToken,
        });

        const accountExists = await this.getAccountByUserId(accountDetails.id);
        if (accountExists)
            throw new ErrorMaker({
                type: 'unprocessable_entity',
                errors: [{message: 'Você não pode adicionar essa conta pois ela já esta farmando.'}],
            });

        const accountId = v4();
        await this.dd.database.db('twitch_accounts').insert({
            id: accountId,
            ownerId,
            email: accountDetails.email,
            login: accountDetails.login,
            userId: accountDetails.id,
            displayName: accountDetails.displayName,
            profileImageUrl: accountDetails.profileImageUrl,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            tokenExpiresAt: tokens.expiresIn.toISO(),
        });

        return {
            id: accountId,
            login: accountDetails.login,
            displayName: accountDetails.displayName,
            profileImageUrl: accountDetails.profileImageUrl,
        };
    }

    async setStreamElementsToken(accountId: string, streamElementsToken: string) {
        await this.dd.database.db('twitch_accounts').where({
            id: accountId
        }).update({
            streamElementsToken: streamElementsToken || null
        })
    }

    async listAccounts(ownerId: string) {
        return this.dd.database.db('twitch_accounts').where({
            ownerId,
        });
    }
}
