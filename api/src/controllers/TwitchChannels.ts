import { ControllerBase } from '../base/Controller';
import { v4 } from 'uuid';
import { ErrorMaker } from '../libs/ErrorMaker';

type TwitchChannel = {
    id: string,
    ownerId: string,
    userId: string,
    login: string,
    displayName: string,
    profileImageUrl: string,
    streamElementsUserAlias: string,
    streamElementsUserId: string,
    createdAt: Date,
    updatedAt: Date,
}

export class TwitchChannelsController extends ControllerBase {
    async addChannel(ownerId: string, twitchUsername: string, streamElementsUsername: string) {
        const twitchAccount = await this.dd.twitchApi.getAccountDetailsByLogin(twitchUsername);
        const streamElementsChannel = await this.dd.streamElementsApi.getChannel(streamElementsUsername);
        const channelId = v4();

        const streamerAlreadyExists = await this.dd.database.db('twitch_channels').where({
            ownerId,
            userId: twitchAccount.id
        }).first();
        if (streamerAlreadyExists) throw new ErrorMaker({
            type: 'unprocessable_entity',
            errors: [{
                message: 'Você ja esta farmando neste canal!'
            }]
        });

        await this.dd.database.db('twitch_channels').insert(({
            id: channelId,
            ownerId,
            userId: twitchAccount.id,
            login: twitchAccount.login,
            displayName: twitchAccount.displayName,
            profileImageUrl: twitchAccount.profileImageUrl,
            streamElementsUserAlias: streamElementsChannel.alias,
            streamElementsUserId: streamElementsChannel.userId
        })).catch(err => {
            console.log(err);
            throw new ErrorMaker({ type: 'database', errors: [{ message: 'Ocorreu um erro no banco de dados!' }] });
        });
        return {
            id: channelId
        };
    }

    async removeChannel(channelId: string) {
        await this.dd.database.db('twitch_channels').where({ id: channelId }).del();
    }

    async listChannels(ownerId: string): Promise<TwitchChannel[]> {
        const channels = await this.dd.database.db('twitch_channels').where({ ownerId: ownerId });
        return channels;
    }
}