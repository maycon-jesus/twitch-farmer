import { RouteBase } from '../../base/Route';

export default class ProxysPingQueue extends RouteBase {
    constructor() {
        super({
            path: '/proxys-ping'
        });
    }

    async run() {
       this.router.get('/', async (req,res)=> {
           const items:any[] =await this.dd.proxyListPing.listPings()
           res.json(items)
       })
    }
}