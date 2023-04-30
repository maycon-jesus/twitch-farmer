import {RouteBase} from "../../../base/Route";

export default class GetAccountDetailsRoute extends RouteBase {
    constructor() {
        super();
    }

    run() {
        this.router.get('/', async (req, res) => {
            try {
                const params: any = req.params
                const account = await this.dd.twitchAccounts.getAccountById(params.accountId)
                res.json(account)
            } catch (e) {

            }
        })
    }
}