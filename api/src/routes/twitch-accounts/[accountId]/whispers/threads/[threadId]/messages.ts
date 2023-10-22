import { RouteBase } from '../../../../../../base/Route';
import { TwitchThread, TwitchWhisper } from '../../../../../../controllers/TwitchWhispers';
import { TwitchUser } from '../../../../../../controllers/TwitchUsers';

type WhisperWithAccountData = TwitchWhisper & {
    authorUser: TwitchUser
}

export default class ThreadIdMessagesRouter extends RouteBase {
    constructor() {
        super({
            path: '/messages'
        });
    }

    run() {
        this.router.get('/', async(req,res)=>{
            const params = req.params as any
            const whispers = await this.dd.twitchWhispers.getWhispersFromThreadId(params.threadId)

            const nWhispers: WhisperWithAccountData[] = []

            for(const whisper of whispers){
                const authorUser = await this.dd.twitchUsers.getUserById(whisper.authorId)
                if(!authorUser) continue;

                nWhispers.push({
                    ...whisper,
                    authorUser: authorUser
                })
            }
            res.json(nWhispers)
        })
    }
}