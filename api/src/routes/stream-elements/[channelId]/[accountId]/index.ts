import { RouteBase } from '../../../../base/Route';

export class StreamElementsAccountIdRoute extends RouteBase {
    constructor() {
        super({
            path: '/:accountId',
        });
    }
}
