import { ServiceBase } from '../base/Service';
import tmi from 'tmi.js';
import type { TwitchAccount } from '../controllers/TwitchAccounts';
import NodeCache from 'node-cache';

class TwitchBot {
    tmiClient: tmi.Client;

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

                this.tmiClient.on('whisper', (from,user,message,self)=>{
                    console.log('whisper', from,user,message,self)
                })
            })
            .catch((err) => console.error(err));
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
        }
    }

    getAccountBot(accountId: string) {
        return this.bots[accountId];
    }

    addAccount(account: TwitchAccount, channels: string[]) {
        this.bots[account.id] = new TwitchBot(account, channels);
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
