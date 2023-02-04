"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchBotQueueModule = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const redis_module_1 = require("../../modules/Redis/redis.module");
const twitchBot_module_1 = require("../../modules/TwitchBot/twitchBot.module");
const twitchFarmerApi_module_1 = require("../../modules/TwitchFarmerApi/twitchFarmerApi.module");
const twitchBotQueue_event_1 = require("./twitchBotQueue.event");
const twitchBotQueue_worker_1 = require("./twitchBotQueue.worker");
let TwitchBotQueueModule = class TwitchBotQueueModule {
};
TwitchBotQueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'twitch-bot',
            }),
            twitchFarmerApi_module_1.TwitchFarmerApiModule,
            twitchBot_module_1.TwitchBotModule,
            redis_module_1.RedisModule,
        ],
        providers: [twitchBotQueue_event_1.TwitchBotQueueEvent, twitchBotQueue_worker_1.TwitchBotQueueWorker],
    })
], TwitchBotQueueModule);
exports.TwitchBotQueueModule = TwitchBotQueueModule;
//# sourceMappingURL=twitchBotQueue.module.js.map