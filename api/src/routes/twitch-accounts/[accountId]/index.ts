import {RouteBase} from "../../../base/Route";
import UpdateStreamelementsTokenRoute from "./update-streamelements-token";
import GetAccountDetailsRoute from "./get-account-details";

export default class AccountIdRoute extends RouteBase {
    constructor() {
        super({
            path: '/:accountId',
            childs: [new UpdateStreamelementsTokenRoute(), new GetAccountDetailsRoute()]
        });
    }

    run() {
    }
}