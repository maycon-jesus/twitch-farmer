import { ControllerBase } from '../base/Controller';
import { v4 } from 'uuid';
import { DateTime } from 'luxon';

export type TwitchThread = {
    id:string,
    twitchUserId1:string,
    twitchUserId2:string,
    createdAt:string,
    updatedAt:string
}

export type TwitchWhisper = {
    id:string,
    threadId:string,
    message:string,
    createdAt:string,
    updatedAt:string,
    authorId: string
}

export class TwitchWhispersController extends ControllerBase {
    async getThread(threadId:string){
        const thread = await this.dd.database.db('whispers_threads').where({
            id:threadId
        }).first()
        return thread
    }

    async createThreadIfNotExists(threadId:string, userId1:string,userId2:string){
        const thread = await this.getThread(threadId)
        if(!thread){
            await this.dd.database.db('whispers_threads').insert({
                id:threadId,
                twitchUserId1: userId1,
                twitchUserId2: userId2,
            })
        }else{
            await this.dd.database.db('whispers_threads').update({updatedAt: DateTime.now().toISO()}).where({id: threadId})
        }
    }

    async addWhisperToThread(threadId:string,authorId:string,message:string){
        await this.dd.database.db('whispers').insert({
            id: v4(),
            threadId,
            message,
            authorId
        })
    }

    async getThreadsFromAccountId(twitchAccountId:string): Promise<TwitchThread[]>{
        const data = await this.dd.database.db('whispers_threads').where({
            twitchUserId1: twitchAccountId
        }).orWhere({
            twitchUserId2: twitchAccountId
        }).orderBy('updatedAt', 'desc')
        return data
    }

    async getWhispersFromThreadId(threadId:string): Promise<TwitchWhisper[]>{
        const data = await this.dd.database.db('whispers').where({threadId}).orderBy('createdAt','desc')
        return data
    }

    async onMessage(from: {
        'user-id':string,
        username:string,
        'thread-id': string
    }, to: {
        userId: string,
        username: string
    },message:string){
        const fromUser = await this.dd.twitchUsers.addUserIfNotExists(from.username)
        const toUser = await this.dd.twitchUsers.addUserIfNotExists(to.username)
        await this.createThreadIfNotExists(from['thread-id'], from['user-id'], to.userId)
        await this.addWhisperToThread(from['thread-id'], from['user-id'],message)
        const account = await this.dd.twitchAccounts.getAccountByUserId(toUser.id)
        if(!account)return;
        await this.dd.notifications.sendWhisperNotification(account.ownerId, {
            fromUser: fromUser.displayName,
            toUser: toUser.displayName,
            toUserId: account.id
        })
    }
}