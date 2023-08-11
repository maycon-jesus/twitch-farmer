import { ControllerBase } from '../base/Controller';

export class StreamElementsPointsController extends ControllerBase {
    async updatePoints(accountId: string, channelId: string, points: number) {
        const hasPointsInDb = await this.dd.database
            .db('streamelements_points')
            .where({ accountId, channelId })
            .first();
        if (hasPointsInDb) {
            await this.dd.database
                .db('streamelements_points')
                .where({ accountId, channelId })
                .update({ value: points });
        } else {
            await this.dd.database.db('streamelements_points').insert({ accountId, channelId, value: points });
        }
    }

    async getAccountChannelPoints(accountId: string, channelId: string) {
        const pointsInDb = await this.dd.database.db('streamelements_points').where({ accountId, channelId }).first();
        if (pointsInDb) {
            return {
                points: pointsInDb.value as number,
            };
        } else {
            return {
                points: 0,
            };
        }
    }

    async deleteByChannelId(channelId:string){
        await this.dd.database.db('streamelements_points').where({
            channelId
        }).delete()
    }

    async deleteByAccountId(accountId:string){
        await this.dd.database.db('streamelements_points').where({
            accountId
        }).delete()
    }
}
