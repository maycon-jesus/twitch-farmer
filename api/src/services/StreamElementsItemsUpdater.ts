import { ServiceBase } from '../base/Service';
import cron from 'cron';
import { DateTime } from 'luxon';

export class StreamElementsItemsUpdaterService extends ServiceBase {
    actualPage = 0;
    private cron: cron.CronJob;

    constructor() {
        super();
        this.cron = new cron.CronJob('0/15 * * * * *', this.loadItems, null, true, undefined, this);
    }

    async loadItems() {
        try {
            const channels = await this.dd.twitchChannels.listChannels({
                offset: this.actualPage,
                limit: 1,
            });

            for (const channel of channels) {
                try{
                    const items = await this.dd.streamElementsApi.getChannelItems(channel.streamElementsUserId);
                    for (const item of items) {
                        await this.dd.streamElementsItems.setItem({
                            id: item._id,
                            streamElementsUserId: channel.streamElementsUserId,
                            category: item.categoryName,
                            cooldownCategory: item.cooldown.category,
                            cooldownUser: item.cooldown.user,
                            cooldownGlobal: item.cooldown.global,
                            cost: item.cost,
                            createdAt: DateTime.fromISO(item.createdAt).toISO()!,
                            description: item.description,
                            enabled: item.enabled ? 1 : 0,
                            inputs: item.userInput,
                            name: item.name,
                            updatedAt: DateTime.fromISO(item.updatedAt).toISO()!,
                            quantityCurrent: item.quantity.total === -1? -1:item.quantity.current,
                            quantityTotal: item.quantity.total,
                            subscriberOnly: item.subscriberOnly ? 1 : 0,
                            thumbnailUrl: item.thumbnail || item.alert?.graphics?.src,
                            allowMessages: item.allowMessages? 1 : 0,
                            deleted: 0,
                        });
                    }

                    const itemsDeleted = await this.dd.streamElementsItems.getChannelItems({
                        streamElementsUserId: channel.streamElementsUserId,
                        idNotIn: items.map((i) => i._id),
                        hideDeleted: true,
                    });
                    for (const item of itemsDeleted) {
                        await this.dd.streamElementsItems.setItem({
                            ...item,
                            deleted: 1,
                        });
                    }
                }catch{}
            }

            if (channels.length > 0) {
                this.actualPage++;
            } else {
                this.actualPage = 0;
            }
        } catch (e) {
            console.error(e);
        }
    }
}
