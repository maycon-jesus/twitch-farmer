import { RouteBase } from '../../base/Route';
import { ErrorToResponse } from '../../libs/ErrorMaker';

export default class GetAddAccountLinkRoute extends RouteBase {
    run(): void {
        this.router.get('/add-account-link', async (req, res) => {
            try {
                const url = await this.dd.twitchAccounts.getAuthorizationUrl(req.jwt.userId);
                res.json({ url: url });
            } catch (e: any) {
                console.log(e);
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}
