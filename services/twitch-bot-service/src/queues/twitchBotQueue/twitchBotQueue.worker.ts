import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Job } from 'bullmq';
import { RedisService } from 'src/modules/Redis/redis.service';
import { TwitchBotService } from 'src/modules/TwitchBot/twitchBot.service';
import { TwitchFarmerApiService } from 'src/modules/TwitchFarmerApi/twitchFarmerApi.service';
import { CustomError } from 'src/utils/CustomError';
import {
  JobInitBotData,
  JobLoadBotState,
  JobLoadData,
  TwitchBotQueueEvent,
} from './twitchBotQueue.event';

@Processor('twitch-bot')
export class TwitchBotQueueWorker extends WorkerHost {
  constructor(
    private twitchFarmerApi: TwitchFarmerApiService,
    private twitchBotQueueEvent: TwitchBotQueueEvent,
    private twitchBotService: TwitchBotService,
    private redisService: RedisService,
  ) {
    super();
  }

  @OnWorkerEvent('ready')
  @Cron(CronExpression.EVERY_10_MINUTES)
  async onReady() {
    const users = await this.twitchFarmerApi.getAllUsers();

    users.forEach(async (user) => {
      await this.twitchBotQueueEvent.pushJobToLoadData({
        user,
      });
    });
  }

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    if (job.name === 'load-data') {
      return await this.loadData(job);
    } else if (job.name === 'init') {
      return await this.initBot(job);
    } else if (job.name === 'load-bot-state') {
      return await this.loadBotState(job);
    }
  }

  async loadData(job: Job<JobLoadData>) {
    const twitchAccounts =
      await this.twitchFarmerApi.getAllTwitchAccountsByUser(job.data.user.id);
    const twitchChannels =
      await this.twitchFarmerApi.getAllTwitchChannelsByUser(job.data.user.id);

    await this.twitchBotQueueEvent.pushJobToInitBot({
      user: job.data.user,
      twitchAccounts,
      twitchChannels,
    });
  }

  async initBot(job: Job<JobInitBotData>) {
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

  async loadBotState(job: Job<JobLoadBotState>) {
    const botState = await this.twitchBotService.getBotState(
      job.data.user.id,
      job.data.twitchAccount.id,
    );
    if (botState instanceof CustomError) return botState;

    await this.redisService.set(
      `twitch-bot.${job.data.user.id}.${job.data.twitchAccount.id}.state`,
      JSON.stringify(botState),
      60000 * 6, // 6 minutos
    );
  }
}
