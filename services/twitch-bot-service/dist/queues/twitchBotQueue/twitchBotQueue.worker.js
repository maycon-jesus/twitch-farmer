"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchBotQueueWorker = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const redis_service_1 = require("../../modules/Redis/redis.service");
const twitchBot_service_1 = require("../../modules/TwitchBot/twitchBot.service");
const twitchFarmerApi_service_1 = require("../../modules/TwitchFarmerApi/twitchFarmerApi.service");
const CustomError_1 = require("../../utils/CustomError");
const twitchBotQueue_event_1 = require("./twitchBotQueue.event");
let TwitchBotQueueWorker = class TwitchBotQueueWorker extends bullmq_1.WorkerHost {
    constructor(twitchFarmerApi, twitchBotQueueEvent, twitchBotService, redisService) {
        super();
        this.twitchFarmerApi = twitchFarmerApi;
        this.twitchBotQueueEvent = twitchBotQueueEvent;
        this.twitchBotService = twitchBotService;
        this.redisService = redisService;
    }
    async onReady() {
        const users = await this.twitchFarmerApi.getAllUsers();
        users.forEach(async (user) => {
            await this.twitchBotQueueEvent.pushJobToLoadData({
                user,
            });
        });
    }
    async process(job, token) {
        if (job.name === 'load-data') {
            return await this.loadData(job);
        }
        else if (job.name === 'init') {
            return await this.initBot(job);
        }
        else if (job.name === 'load-bot-state') {
            return await this.loadBotState(job);
        }
    }
    async loadData(job) {
        const twitchAccounts = await this.twitchFarmerApi.getAllTwitchAccountsByUser(job.data.user.id);
        const twitchChannels = await this.twitchFarmerApi.getAllTwitchChannelsByUser(job.data.user.id);
        await this.twitchBotQueueEvent.pushJobToInitBot({
            user: job.data.user,
            twitchAccounts,
            twitchChannels,
        });
    }
    async initBot(job) {
        for (let i = 0; i < job.data.twitchAccounts.length; i++) {
            const twitchAccount = job.data.twitchAccounts[i];
            await this.twitchBotService.initBot({
                twitchAccount,
                twitchChannels: job.data.twitchChannels,
                user: job.data.user,
            });
            await this.twitchBotQueueEvent.pushJobLoadBotState({
                twitchAccount,
                user: job.data.user,
            });
        }
    }
    async loadBotState(job) {
        const botState = await this.twitchBotService.getBotState(job.data.user.id, job.data.twitchAccount.id);
        if (botState instanceof CustomError_1.CustomError)
            return botState;
        await this.redisService.set(`twitch-bot.${job.data.user.id}.${job.data.twitchAccount.id}.state`, JSON.stringify(botState), 60000 * 6);
    }
};
__decorate([
    (0, bullmq_1.OnWorkerEvent)('ready'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TwitchBotQueueWorker.prototype, "onReady", null);
TwitchBotQueueWorker = __decorate([
    (0, bullmq_1.Processor)('twitch-bot'),
    __metadata("design:paramtypes", [twitchFarmerApi_service_1.TwitchFarmerApiService,
        twitchBotQueue_event_1.TwitchBotQueueEvent,
        twitchBot_service_1.TwitchBotService,
        redis_service_1.RedisService])
], TwitchBotQueueWorker);
exports.TwitchBotQueueWorker = TwitchBotQueueWorker;
//# sourceMappingURL=twitchBotQueue.worker.js.map