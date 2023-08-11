import { ControllerBase } from '../base/Controller';

export type StreamElementsRedemption = {
    id: string,
    itemId: string | null,
    accountId: string,
    ownerId: string,
    channelId: string,
    accessCode: string | null,
    inputs: string[],
    completed: 0 | 1,
    rejected: 0 | 1,
    createdAt: string,
    updatedAt: string,
}

export class StreamElementsRedemptions extends ControllerBase {
    async getRedemption(itemId: string): Promise<StreamElementsRedemption | undefined> {
        const redemption = await this.dd.database.db('streamelements_redemptions').where({ id: itemId }).first();
        return redemption;
    }

    async setRedemption(item: StreamElementsRedemption) {
        const redemptionsExists = await this.getRedemption(item.id);
        if (redemptionsExists) {
            await this.dd.database.db('streamelements_redemptions').where({ id: item.id }).update({
                ...item,
                inputs: JSON.stringify(item.inputs)
            });
        } else {
            await this.dd.database.db('streamelements_redemptions').insert({
                ...item,
                inputs: JSON.stringify(item.inputs)
            });
        }
    }

    async listRedemptions(opts: {
        accountId?: string,
        channelId?: string,
        ownerId?: string,
        pagination: {
            limit: number,
            page: number
        },
        order: {
            by: 'createdAt',
            sort: 'asc'|'desc'
        }
    }) {
        const redemptions = await this.dd.database.db('streamelements_redemptions')
            .where((queryBuilder) => {
                if (opts.accountId) queryBuilder.where({ accountId: opts.accountId });
                if (opts.channelId) queryBuilder.where({ channelId: opts.channelId });
                if (opts.ownerId) queryBuilder.where({ ownerId: opts.ownerId });
            })
            .limit(opts.pagination.limit)
            .offset(opts.pagination.limit * opts.pagination.page - opts.pagination.limit)
            .orderBy(opts.order.by, opts.order.sort)


        const redemptionsMaped: any = redemptions.map((r) => {
            return {
                ...r,
                inputs: JSON.parse(r.inputs)
            };
        });

        for (const redemption of redemptionsMaped) {
            const channel = await this.dd.twitchChannels.getChannel(redemption.channelId);
            const account = await this.dd.twitchAccounts.getAccountById(redemption.accountId);
            const item = await this.dd.streamElementsItems.getItem(redemption.itemId);
            redemption.channel = {
                id: channel.id,
                displayName: channel.displayName,
                login: channel.login,
                profileImageUrl: channel.profileImageUrl
            };
            redemption.account = {
                id: account.id,
                displayName: account.displayName,
                login: account.login,
                profileImageUrl: account.profileImageUrl
            };
            if (item) {
                redemption.item = {
                    id: item.id,
                    name: item.name
                };
            }
        }
        return redemptionsMaped;
    }

    async countRedemptions(opts: {
        accountId?: string,
        channelId?: string,
        ownerId?: string
    }): Promise<number> {
        const redemptions = await this.dd.database.db('streamelements_redemptions')
            .where((queryBuilder) => {
                if (opts.accountId) queryBuilder.where({ accountId: opts.accountId });
                if (opts.channelId) queryBuilder.where({ channelId: opts.channelId });
                if (opts.ownerId) queryBuilder.where({ ownerId: opts.ownerId });
            }).count<[{ count: number }]>('* as count');
        return redemptions[0].count;
    }
}