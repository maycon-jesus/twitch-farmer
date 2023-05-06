import { RouteBase } from '../../../base/Route';
import { ErrorToResponse } from '../../../libs/ErrorMaker';

export default class GetAccountDetailsRoute extends RouteBase {
    constructor() {
        super();
    }

    run() {
        this.router.get('/', async (req, res) => {
            try {
                const params: any = req.params;
                const account = await this.dd.twitchAccounts.getAccountById(params.accountId);
                res.json(account);
            } catch (e: any) {
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}
