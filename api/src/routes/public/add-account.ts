import { RouteBase } from '../../base/Route';
import { z } from 'zod';
import { ErrorMaker, ErrorToResponse } from '../../libs/ErrorMaker';

export default class AddtwitchAccount extends RouteBase {
    bodyValidator = z.object({
        identifyCode: z.string().uuid(),
        code: z.string(),
        redirectUrl: z.string().url(),
    });

    run(): void {
        this.router.post('/add-twitch-account', async (req, res) => {
            try {
                const body = this.bodyValidator.safeParse(req.body);
                if (!body.success)
                    throw new ErrorMaker({
                        type: 'form_validation',
                        errors: body.error.errors,
                    });

                const nAccount = await this.dd.twitchAccounts.insert(
                    body.data.code,
                    body.data.identifyCode,
                    body.data.redirectUrl
                );
                const account = await this.dd.twitchAccounts.getAccountById(nAccount.id);
                if (!account)
                    throw new ErrorMaker({
                        type: 'not_found',
                        errors: [{ message: 'Conta não encontrada' }],
                    });
                const channels = await this.dd.twitchChannels.listChannels({ ownerId: account.ownerId });

                await this.dd.services.twitchBot.addAccount(
                    account,
                    channels.map((c) => c.login)
                );

                res.json({
                    id: nAccount.id,
                    profileImageUrl: nAccount.profileImageUrl,
                    login: nAccount.login,
                    displayName: nAccount.displayName,
                });
            } catch (e: any) {
                console.log(e);
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}
