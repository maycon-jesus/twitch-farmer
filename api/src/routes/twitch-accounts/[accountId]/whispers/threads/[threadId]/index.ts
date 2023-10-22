import { RouteBase } from '../../../../../../base/Route';
import ThreadIdMessagesRouter from './messages';

export default class ThreadIdRouter extends RouteBase {
    constructor() {
        super({
            path: '/threads/:threadId',
            childs: [new ThreadIdMessagesRouter()]
        });
    }
}