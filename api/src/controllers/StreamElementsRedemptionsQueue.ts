import { ControllerBase } from '../base/Controller';
import { ErrorMaker } from '../libs/ErrorMaker';
import { v4 } from 'uuid';

interface StreamElementsRedemptionQueue {
    id: string,
    itemId:string,
    accountId:string,
    channelId:string,
    ownerId:string,
    completed:0|1,
    error: 0|1,
    errorReason: string|null,
    priority:number,
    createdAt: string,
    updatedAt:string
}

export class StreamElementsRedemptionsQueue extends ControllerBase {
    async getItemFromQueue(filters: {
        id?:string,
        channelId?: string,
        accountId?: string,
        completed?: boolean
    }):Promise<StreamElementsRedemptionQueue|undefined> {
        const data = await this.dd.database.db('streamelements_redemptions_queue').where((queryBuilder) => {
            if (filters.channelId) queryBuilder.where({ channelId: filters.channelId });
            if (filters.id) queryBuilder.where({id: filters.id});
            if (filters.accountId) queryBuilder.where({ accountId: filters.accountId });
            if (filters.completed !== undefined) queryBuilder.where({ completed: filters.completed ? 1 : 0 });
        }).first();
        return data
    }

    async listItemsFromQueue(filters: {
        itemId?: string,
        ownerId?: string,
        completed?: boolean
        order?: {
            by: 'priority'|'createdAt',
            sort: 'asc'|'desc'
        },
        orderByRaw?: string
    }): Promise<StreamElementsRedemptionQueue[]>{
        const data = await this.dd.database.db('streamelements_redemptions_queue').where((queryBuilder) => {
            if(filters.itemId) queryBuilder.where({itemId: filters.itemId})
            if(filters.ownerId) queryBuilder.where({ownerId: filters.ownerId})
            if (filters.completed !== undefined) queryBuilder.where({ completed: filters.completed ? 1 : 0 });
        })
            .orderByRaw(filters.orderByRaw||`${filters.order?.by} ${filters.order?.sort}`)
        return data
    }

    async getStreamElementsItemQueueSize(itemId:string):Promise<number>{
        const data:any = await this.dd.database.db('streamelements_redemptions_queue').where({itemId, completed: 0}).count('id as count')
        return data[0].count as number
    }

    async getItemQueuePosition(itemId:string,queueItemId:string):Promise<number>{
        const allItems = await this.listItemsFromQueue({
            itemId,
            completed: false,
            orderByRaw: 'priority desc, createdAt asc'
        })
        let count = 0
        allItems.find(i => {
            count++
            if(i.id === queueItemId)return true
        })
        return count
    }

    async addItemToQueue(ownerId: string, accountId: string, channelId:string,itemId: string, inputs:string[],priority: number) {
        const hasSameAccountAndChannelItemOnQueue = await this.getItemFromQueue({
            channelId: channelId,
            accountId: accountId,
            completed: false
        })
        if(hasSameAccountAndChannelItemOnQueue) throw new ErrorMaker({
            type: 'not_found',
            errors: [{ message: 'Por segurança não é possivel adicionar a mesma conta para resgatar duas vezes no mesmo canal!' }]
        });

        const owner = await this.dd.users.findOne(ownerId);
        const account = await this.dd.twitchAccounts.getAccountById(accountId);

        const item = await this.dd.streamElementsItems.getItem(itemId);
        if (!item||item.deleted) throw new ErrorMaker({
            type: 'not_found',
            errors: [{ message: 'Item não encontrado!' }]
        });

        const channel = await this.dd.twitchChannels.getChannel(channelId);
        if(channel.streamElementsUserId !== item.streamElementsUserId) throw new ErrorMaker({
            type: 'not_found',
            errors: [{ message: 'Item não encontrado!' }]
        });

        await this.dd.database.db('streamelements_redemptions_queue').insert({
            id: v4(),
            inputs: JSON.stringify(inputs),
            itemId,
            accountId,
            channelId,
            ownerId,
            priority,
        })
    }

    async setItemStatus(data:{
        itemId:string,
        completed:boolean,
        error: boolean,
        errorReason?: string
    }){
        await this.dd.database.db('streamelements_redemptions_queue').where({id: data.itemId}).update({
            completed: data.completed? 1:0,
            error: data.error? 1:0,
            errorReason: data.errorReason||null,
        })
    }

    async deleteItem(itemId:string){
        await this.dd.database.db('streamelements_redemptions_queue').where({id: itemId}).del()
    }

    async deleteItemsByChannelId(channelId:string){
        await this.dd.database.db('streamelements_redemptions_queue').where({channelId}).del()
    }

    async deleteItemsByAccountId(accountId:string){
        await this.dd.database.db('streamelements_redemptions_queue').where({accountId}).del()
    }
}