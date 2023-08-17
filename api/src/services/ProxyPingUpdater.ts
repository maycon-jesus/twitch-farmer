import { ServiceBase } from '../base/Service';
import cron from 'cron';
import axios from "axios"

export class ProxyPingUpdaterService extends ServiceBase {
    actualPage = 0;
    private cron: cron.CronJob;

    constructor() {
        super();
        this.cron = new cron.CronJob('0/15 * * * * *', this.loadItems, null, true, undefined, this);
    }

    async loadItems() {
        try {
            const proxy = this.dd.webShareProxy.proxyList[this.actualPage]
            if(!proxy){
                this.actualPage=0
                return
            }
            this.actualPage++

            const start = Date.now()
            await axios.post(`https://api.streamelements.com/kappa/v2/store/5cc799026e852d26fcf16717/redemptions/123456789`, {
                proxy: this.dd.webShareProxy.transformToAxios(proxy)
            })
                .then(()=>{})
                .catch(()=>{})
            await this.dd.proxyListPing.setStreamElementsRedemptionsPing(proxy.proxyAddress, (Date.now()-start)/2)
        } catch (e) {
            console.error(e);
        }
    }
}
