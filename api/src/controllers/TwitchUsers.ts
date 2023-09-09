import { ControllerBase } from '../base/Controller';

export type TwitchUser = {
    id:string,
    login:string,
    displayName:string,
    profileImageUrl:string,
    createdAt:string,
    updatedAt:string
}

export class TwitchUsersController extends ControllerBase {
    async getUserByLogin(twitchLogin:string):Promise<TwitchUser|undefined>{
        const user = await this.dd.database.db('twitch_users').where({
            login: twitchLogin
        }).first()
        return user
    }

    async getUserById(twitchId:string):Promise<TwitchUser|undefined>{
        const user = await this.dd.database.db('twitch_users').where({
            id: twitchId
        }).first()
        return user
    }

    async addUserIfNotExists(twitchUserLogin:string):Promise<TwitchUser> {
        const userExists:any = await this.getUserByLogin(twitchUserLogin)
        if(userExists) return userExists
        const twitchAccount = await this.dd.twitchApi.getAccountDetailsByLogin(twitchUserLogin);
        await this.dd.database.db('twitch_users').insert({
            id: twitchAccount.id,
            login: twitchAccount.login,
            displayName: twitchAccount.displayName,
            profileImageUrl: twitchAccount.profileImageUrl
        })
        const user = await this.getUserByLogin(twitchUserLogin) as TwitchUser
        return user
    }
}