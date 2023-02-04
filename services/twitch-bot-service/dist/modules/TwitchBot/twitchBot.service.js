"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchBotService = void 0;
const common_1 = require("@nestjs/common");
const CustomError_1 = require("../../utils/CustomError");
const tmi = require("tmi.js");
let TwitchBotService = class TwitchBotService {
    constructor() {
        this.bots = [];
    }
    botExists(userId, accountId) {
        const bot = this.bots.find((bot) => {
            return bot.user.id === userId && bot.twitchAccount.id === accountId;
        });
        return !!bot;
    }
    async insertBot(twitchBot) {
        this.bots.push(twitchBot);
    }
    async initBot(initBotData) {
        if (this.botExists(initBotData.user.id, initBotData.twitchAccount.id))
            throw new Error('Bot already exists');
        const channelsStringArr = initBotData.twitchChannels.map((c) => c.username);
        const client = new tmi.Client({
            identity: {
                username: initBotData.twitchAccount.username,
                password: initBotData.twitchAccount.accessToken,
            },
            connection: {
                reconnect: true,
                maxReconnectAttempts: Infinity,
                maxReconnectInterval: 30000,
                reconnectDecay: 1,
                reconnectInterval: 1000,
            },
            channels: channelsStringArr,
        });
        await client.connect();
        await this.insertBot({
            client,
            twitchAccount: initBotData.twitchAccount,
            twitchChannels: initBotData.twitchChannels,
            user: initBotData.user,
        });
    }
    async getBotState(userId, accountId) {
        const botData = this.bots.find((bot) => {
            return bot.user.id === userId && bot.twitchAccount.id === accountId;
        });
        if (!botData)
            return new CustomError_1.CustomError(new Error('Bot não encontrado'), {
                code: 'BOT_NOT_FOUND',
            });
        return {
            readyState: botData.client.readyState(),
            channels: botData.client.getChannels(),
        };
    }
};
TwitchBotService = __decorate([
    (0, common_1.Injectable)()
], TwitchBotService);
exports.TwitchBotService = TwitchBotService;
//# sourceMappingURL=twitchBot.service.js.map