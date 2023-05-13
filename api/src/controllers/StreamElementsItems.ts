import { ControllerBase } from '../base/Controller';

type StreamElementsItem = {
    id: string;
    streamElementsUserId: string;
    cooldownUser: number;
    cooldownGlobal: number;
    cooldownCategory: number;
    cost: number;
    name: string;
    description: string;
    category: string;
    thumbnailUrl: string;
    enabled: 0 | 1;
    subscriberOnly: 0 | 1;
    quantityTotal: number;
    quantityCurrent: number;
    inputs: string[];
    createdAt: string;
    updatedAt: string;
    deleted: 0 | 1;
};

export class StreamElementsItemsController extends ControllerBase {
    async getItem(itemId: string): Promise<StreamElementsItem | undefined> {
        return await this.dd.database.db('streamelements_items').where({ id: itemId }).first();
    }

    async setItem(item: StreamElementsItem) {
        const itemExists = await this.getItem(item.id);
        const itemToDb = {
            ...item,
            category: item.category || null,
            thumbnailUrl: item.thumbnailUrl || null,
            inputs: JSON.stringify(item.inputs),
        };
        if (itemExists) {
            await this.dd.database.db('streamelements_items').update(itemToDb).where({ id: item.id });
        } else {
            await this.dd.database.db('streamelements_items').insert(itemToDb);
        }
    }

    async getChannelItems(opts: {
        streamElementsUserId?: string;
        idNotIn?: string[];
        hideDeleted?: boolean;
    }): Promise<StreamElementsItem[]> {
        const items = await this.dd.database.db('streamelements_items').where((queryBuilder) => {
            if (opts.streamElementsUserId) queryBuilder.where({ streamElementsUserId: opts.streamElementsUserId });
            if (opts.idNotIn) queryBuilder.whereNotIn('id', opts.idNotIn);
            if (opts.hideDeleted) queryBuilder.where({ deleted: 0 });
        });
        return items.map((i) => {
            return {
                ...i,
                inputs: JSON.parse(i.inputs),
            };
        });
    }
}
