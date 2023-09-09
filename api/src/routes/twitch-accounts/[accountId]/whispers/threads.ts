import { RouteBase } from '../../../../base/Route';
import { TwitchThread } from '../../../../controllers/TwitchWhispers';
import { TwitchUser } from '../../../../controllers/TwitchUsers';

type ThreadWithAccountData = TwitchThread & {
    twitchUser1: TwitchUser
    twitchUser2: TwitchUser
}

export default class WhispersThreadsRoute extends RouteBase {
    constructor() {
        super({
            path: '/threads',
        });
    }

    run() {
        this.router.get('/',async (req,res)=>{
            const params = req.params as any
            const account = await this.dd.twitchAccounts.getAccountById(params.accountId)
            const threads = await this.dd.twitchWhispers.getThreadsFromAccountId(account.userId)

            const nThreads: ThreadWithAccountData[] = []

            for(const thread of threads){
                const user1 = await this.dd.twitchUsers.getUserById(thread.twitchUserId1)
                const user2 = await this.dd.twitchUsers.getUserById(thread.twitchUserId2)
                if(!user1 || !user2) continue;
                nThreads.push({
                    ...thread,
                    twitchUser1: user1,
                    twitchUser2: user2
                })
            }

            res.json(nThreads)
        })
    }
}