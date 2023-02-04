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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchBotQueueEvent = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
let TwitchBotQueueEvent = class TwitchBotQueueEvent {
    constructor(twitchBotQueue) {
        this.twitchBotQueue = twitchBotQueue;
    }
    pushJobToLoadData(data) {
        this.twitchBotQueue.add('load-data', data);
    }
    pushJobToInitBot(data) {
        this.twitchBotQueue.add('init', data);
    }
    async pushJobLoadBotState(data) {
        await this.twitchBotQueue.add('load-bot-state', data, {
            jobId: `twitch-bot-load-bot-state-${data.user.id}-${data.twitchAccount.id}`,
            repeatJobKey: `twitch-bot-load-bot-state-${data.user.id}-${data.twitchAccount.id}`,
            repeat: {
                every: 1000,
                immediately: true,
            },
        });
    }
};
TwitchBotQueueEvent = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('twitch-bot')),
    __metadata("design:paramtypes", [Function])
], TwitchBotQueueEvent);
exports.TwitchBotQueueEvent = TwitchBotQueueEvent;
//# sourceMappingURL=twitchBotQueue.event.js.map