import { RouteBase } from '../../base/Route';

export default class RouteRedemptionsQueue extends RouteBase {
    constructor() {
        super({
            path: '/redemptions-queue'
        });
    }

    async run() {
       this.router.get('/', async (req,res)=> {
           const items:any[] = await this.dd.streamElementsRedemptionsQueue.listItemsFromQueue({
               completed: false,
               orderByRaw: 'priority desc, createdAt asc'
           })
           const channels:string[] = []

           for(const item of items){
               const account = await this.dd.twitchAccounts.getAccountById(item.accountId)
               const channel = await this.dd.twitchChannels.getChannel(item.channelId)
               const itemDb = await this.dd.streamElementsItems.getItem(item.itemId)
               item.streamElementsToken=account.streamElementsToken
               item.cooldownGlobal=itemDb?.cooldownGlobal
               item.inputs=JSON.parse(item.inputs)
               if(!channels.includes(channel.streamElementsUserId)) channels.push(channel.streamElementsUserId)
           }

           const itemsGrouped = items.reduce<Record<string, any[]>>((p,v)=>{
               if(p[v.itemId]){
                   p[v.itemId].push(v)
               }else{
                   p[v.itemId]=[v]
               }
               return p
           }, {})
           res.json({
               items: itemsGrouped,
               channels
           })
       })
    }
}