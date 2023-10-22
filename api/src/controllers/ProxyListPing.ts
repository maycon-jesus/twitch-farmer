import { ControllerBase } from '../base/Controller';

export class ProxyListPingController extends ControllerBase {
    async listPings() {
        return await this.dd.database.db('proxy_list_ping');
    }

    async setStreamElementsRedemptionsPing(ip: string, ping: number) {
        const proxy = await this.dd.database.db('proxy_list_ping').where({ ip }).first();
        if (!proxy) {
            await this.dd.database
                .db('proxy_list_ping')
                .where({ ip })
                .insert({ ip, streamElementsRedemptionPing: ping });
        } else {
            await this.dd.database
                .db('proxy_list_ping')
                .where({ ip })
                .update({ ip, streamElementsRedemptionPing: ping });
        }
    }
}
