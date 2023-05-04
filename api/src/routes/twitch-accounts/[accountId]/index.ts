import {RouteBase} from "../../../base/Route";
import UpdateStreamelementsTokenRoute from "./update-streamelements-token";
import GetAccountDetailsRoute from "./get-account-details";
import AccountDeleteRoute from './delete';

export default class AccountIdRoute extends RouteBase {
    constructor() {
        super({
            path: '/:accountId',
            childs: [new UpdateStreamelementsTokenRoute(), new GetAccountDetailsRoute(), new AccountDeleteRoute()]
        });
    }

    run() {
    }
}