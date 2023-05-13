import { RouteBase } from '../../../../base/Route';
import ItemsRoute from './items';

export default class StoreRoute extends RouteBase {
    constructor() {
        super({
            path: '/store',
            childs: [new ItemsRoute()],
        });
    }
}
