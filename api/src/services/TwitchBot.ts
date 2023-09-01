import { ServiceBase } from '../base/Service';
import tmi from 'tmi.js';
import type { TwitchAccount } from '../controllers/TwitchAccounts';
import NodeCache from 'node-cache';
import { EventEmitter } from 'events';
import { waitTime } from '../utils/waitTime';

class TwitchBot {
    tmiClient: tmi.Client;
    events= new EventEmitter()

    constructor(private twitchAccount: TwitchAccount, private channels: string[]) {
        this.tmiClient = new tmi.Client({
            identity: {
                username: twitchAccount.login,
                password: 'oauth:' + twitchAccount.accessToken,
            },
        });
        this.tmiClient
            .connect()
            .then((r) => {
                console.log(r);
                this.enterChannels();
            })
            .catch((err) => console.error(err));

        this.tmiClient.on('whisper' as any, (from,user,message,self)=>{
            this.events.emit('whisper', {
                user,
                message
            })
        })
    }

    get state() {
        return this.tmiClient.readyState();
    }

    get channelsConnected() {
        return this.tmiClient.getChannels();
    }

    get totalChannels() {
        return this.channels.length;
    }

    enterChannels() {
        this.channels.forEach((channel, i) => {
            setTimeout(() => {
                this.enterChannel(channel)
                    .then()
                    .catch((e) => console.error(e));
            }, i * 1000);
        });
    }

    async enterChannel(username: string) {
        if (!this.channels.includes(username)) this.channels.push(username);
        return this.tmiClient.join(username);
    }

    async leaveChannel(username: string) {
        this.channels = this.channels.filter((c) => c !== username);
        return this.tmiClient.part(username);
    }

    async disconnect() {
        return await this.tmiClient
            .disconnect()
            .then()
            .catch((e) => console.error(e));
    }

    async changeToken(token: string) {
        await this.disconnect();
        this.tmiClient.getOptions().identity!.password = 'oauth:' + token;
        this.tmiClient.getOptions().channels = this.channels;
        await this.tmiClient
            .connect()
            .then()
            .catch((e) => {
                console.error(e);
            });
    }
}

export class TwitchBotService extends ServiceBase {
    bots: {
        [accountId: string]: TwitchBot | undefined;
    } = {};
    channelsCache = new NodeCache({ stdTTL: 60 * 5 });

    constructor() {
        super();
        this.loadAccounts().then();
    }

    async loadAccounts() {
        const accounts = await this.dd.twitchAccounts.listAccounts({
            filters: {
                removeBanned: true,
                removeTokenInvalid: true,
            },
        });

        for (const account of accounts) {
            const channelsCache = this.channelsCache.get<string[]>(account.ownerId);
            if (channelsCache) {
                this.addAccount(account, channelsCache);
            } else {
                const channels = await this.dd.twitchChannels.listChannels({
                    ownerId: account.ownerId,
                });
                const channelsMap = channels.map((c) => c.login);
                this.channelsCache.set(account.ownerId, channelsMap);
                this.addAccount(account, channelsMap);
            }
            await waitTime(1000)
        }
    }

    getAccountBot(accountId: string) {
        return this.bots[accountId];
    }

    addAccount(account: TwitchAccount, channels: string[]) {
        const twitchBot = new TwitchBot(account, channels)
        this.bots[account.id] = twitchBot;
        twitchBot.events.on('whisper', ({user,message})=> {
            this.dd.twitchWhispers.onMessage({
                'thread-id': user['thread-id'],
                username: user.username,
                'user-id': user['user-id'],
            }, {
                username: account.login,
                userId: account.userId
            },message)
        })
    }

    async removeAccount(accountId: string) {
        const bot = await this.bots[accountId];
        if (!bot) return;
        await bot.disconnect();
    }

    async joinChannel(accountId: string, username: string) {
        return this.getAccountBot(accountId)?.enterChannel(username);
    }

    async joinChannelForUserAccounts(ownerId: string, username: string) {
        const accounts = await this.dd.twitchAccounts.listAccounts({
            ownerId,
            filters: {
                removeBanned: true,
                removeTokenInvalid: true,
            },
        });
        for (const account of accounts) {
            await this.joinChannel(account.id, username).then(()=>{}).catch(()=>{});
        }
    }

    async leaveChannel(accountId: string, username: string) {
        return this.getAccountBot(accountId)?.leaveChannel(username);
    }

    async leaveChannelForUserAccounts(ownerId: string, username: string) {
        const accounts = await this.dd.twitchAccounts.listAccounts({
            ownerId,
            filters: {
                removeBanned: true,
                removeTokenInvalid: true,
            },
        });
        for (const account of accounts) {
            await this.leaveChannel(account.id, username).then(()=>{}).catch(()=>{});
        }
    }

    async changeAccountToken(accountId: string, token: string) {
        await this.getAccountBot(accountId)?.changeToken(token);
    }
}
