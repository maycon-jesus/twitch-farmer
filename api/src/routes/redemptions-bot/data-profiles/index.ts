import { RouteBase } from '../../../base/Route';
import AddDataProfilesRoute from './add-data-profile';
import ListDataProfilesRoute from './list';

export default class DataProfilesRoute extends RouteBase {
    constructor() {
        super({
            path: '/data-profiles',
            middlewares: [],
            childs: [new AddDataProfilesRoute(), new ListDataProfilesRoute()]
        });
    }
}