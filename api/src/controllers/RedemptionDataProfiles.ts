import { ControllerBase } from '../base/Controller';
import { v4 } from 'uuid';
import { ErrorMaker } from '../libs/ErrorMaker';

export type RedemptionDataProfile = {
    id: string,
    ownerId: string,
    accountId: string | null,
    nameComplete: string | null,
    firstName: string | null,
    pix: string | null,
    steamTradeLink: string | null,
    email: string | null,
}

export class RedemptionDataProfilesController extends ControllerBase {
    async insertProfile(ownerId: string, data: {
        accountId?: string|null,
        nameComplete?: string|null,
        firstName?: string|null,
        pix?: string|null,
        steamTradeLink?: string|null,
        email?: string|null
    }) {
        await this.dd.database.db('redemption_data_profiles').insert({
            id: v4(),
            ownerId,
            accountId: data.accountId || null,
            nameComplete: data.nameComplete || null,
            firstName: data.firstName || null,
            pix: data.pix || null,
            steamTradeLink: data.steamTradeLink || null,
            email: data.email || null
        });
    }

    async updateProfile(id: string, data: {
        accountId?: string,
        nameComplete?: string,
        firstName?: string,
        pix?: string,
        steamTradeLink?: string,
        email?: string
    }) {
        await this.dd.database.db('redemption_data_profiles').update({
            accountId: data.accountId || null,
            nameComplete: data.nameComplete || null,
            firstName: data.firstName || null,
            pix: data.pix || null,
            steamTradeLink: data.steamTradeLink || null,
            email: data.email || null
        }).where({ id });
    }

    async markProfileUsed(profileId: string, redemptionQueueItemId: string) {
        await this.dd.database.db('redemption_data_profiles_used').insert({
            idRedemptionDataProfile: profileId,
            idRedemptionQueue: redemptionQueueItemId
        });
    }

    async getRandomProfileAvailable(ownerId: string, channelId: string, accountId: string, allowRepeat: boolean, items: string[]): Promise<RedemptionDataProfile | null> {
        let profilesUsedIds:string[] = [];

        if (!allowRepeat) {
            const itemsInQueue = await this.dd.streamElementsRedemptionsQueue.listItemsFromQueue({
                completed: false,
                ownerId,
                channelId,
                order: {
                    by: 'createdAt',
                    sort: 'desc'
                }
            });
            const itemsInQueueIds = itemsInQueue.map(i => i.id);
            const profilesUsed = await this.dd.database.db('redemption_data_profiles_used')
                .whereIn('idRedemptionQueue', itemsInQueueIds);
            profilesUsedIds = profilesUsed.map(profile => profile.idRedemptionDataProfile);
        }

        const accountIdHasYourProfiles = await this.dd.database.db('redemption_data_profiles').where({ accountId }).count('* as count').first();
        if (!accountIdHasYourProfiles) throw new ErrorMaker({
            type: 'other',
            errors: [{ message: 'Ocorreu um erro interno!' }]
        });

        if (Number(accountIdHasYourProfiles.count) > 0) {
            const profileAvailable = await this.dd.database.db('redemption_data_profiles')
                .where({ ownerId, accountId })
                .whereNotIn('id', profilesUsedIds)
                .andWhere((qb)=>{
                    for(const item of items){
                        qb.whereNotNull(item)
                    }
                })
                .orderByRaw('RAND()')
                .limit(1)
                .first();
            if (!profileAvailable) return null;
            return profileAvailable;
        } else {
            const profileAvailable = await this.dd.database.db('redemption_data_profiles')
                .where({ ownerId, accountId: null })
                .whereNotIn('id', profilesUsedIds)
                .andWhere((qb)=>{
                    for(const item of items){
                        qb.whereNotNull(item)
                    }
                })
                .orderByRaw('RAND()')
                .limit(1)
                .first();
            if (!profileAvailable) return null;
            return profileAvailable;
        }
    }

    async listProfiles(filters:{
        ownerId?:string
    }):Promise<RedemptionDataProfile[]>{
        const data = await this.dd.database.db('redemption_data_profiles').where((qb)=>{
            if(filters.ownerId) qb.where({ownerId:filters.ownerId})
        })
        return data
    }
}