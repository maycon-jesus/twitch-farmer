import { ControllerBase } from '../base/Controller';
import { v4 } from 'uuid';

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

    async onMessage(from: {
        'user-id':string,
        username:string,
        'thread-id': string
    }, to: {
        userId: string,
        username: string
    },message:string){
        await this.dd.twitchUsers.addUserIfNotExists(from.username)
        await this.dd.twitchUsers.addUserIfNotExists(to.username)
        await this.createThreadIfNotExists(from['thread-id'], from['user-id'], to.userId)
        await this.addWhisperToThread(from['thread-id'], from['user-id'],message)
    }
}