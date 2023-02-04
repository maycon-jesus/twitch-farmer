import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RedisService } from 'src/modules/Redis/redis.service';
import { TwitchBotService } from 'src/modules/TwitchBot/twitchBot.service';
import { TwitchFarmerApiService } from 'src/modules/TwitchFarmerApi/twitchFarmerApi.service';
import { CustomError } from 'src/utils/CustomError';
import { JobInitBotData, JobLoadBotState, JobLoadData, TwitchBotQueueEvent } from './twitchBotQueue.event';
export declare class TwitchBotQueueWorker extends WorkerHost {
    private twitchFarmerApi;
    private twitchBotQueueEvent;
    private twitchBotService;
    private redisService;
    constructor(twitchFarmerApi: TwitchFarmerApiService, twitchBotQueueEvent: TwitchBotQueueEvent, twitchBotService: TwitchBotService, redisService: RedisService);
    onReady(): Promise<void>;
    process(job: Job<any, any, string>, token?: string): Promise<any>;
    loadData(job: Job<JobLoadData>): Promise<void>;
    initBot(job: Job<JobInitBotData>): Promise<void>;
    loadBotState(job: Job<JobLoadBotState>): Promise<CustomError<"BOT_NOT_FOUND">>;
}
