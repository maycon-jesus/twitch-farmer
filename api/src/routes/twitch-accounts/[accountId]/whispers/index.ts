import { RouteBase } from '../../../../base/Route';
import WhispersThreadsRoute from './threads';
import ThreadIdRouter from './threads/[threadId]';

export default class WhispersRoute extends RouteBase {
    constructor() {
        super({
            path: '/whispers',
            childs: [
                new WhispersThreadsRoute(),
                new ThreadIdRouter()
            ]
        });
    }
}