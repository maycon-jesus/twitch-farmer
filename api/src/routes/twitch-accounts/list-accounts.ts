import { RouteBase } from '../../base/Route';
import { ErrorToResponse } from '../../libs/ErrorMaker';

export default class ListAccounts extends RouteBase {
    run(): void {
        this.router.get('/', async (req, res) => {
            try {
                const accounts = await this.dd.twitchAccounts.listAccounts(req.jwt.userId);
                const accountsMapped = accounts
                    .map((account) => {
                        return {
                            id: account.id,
                            login: account.login,
                            displayName: account.displayName,
                            profileImageUrl: account.profileImageUrl,
                        };
                    })
                    .sort((a, b) => {
                        return a.login.localeCompare(b.login);
                    });
                res.json(accountsMapped);
            } catch (e: any) {
                console.log(e);
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}
