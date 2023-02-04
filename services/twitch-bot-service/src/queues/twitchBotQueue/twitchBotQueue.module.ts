import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { RedisModule } from 'src/modules/Redis/redis.module';
import { TwitchBotModule } from 'src/modules/TwitchBot/twitchBot.module';
import { TwitchFarmerApiModule } from 'src/modules/TwitchFarmerApi/twitchFarmerApi.module';
import { TwitchBotQueueEvent } from './twitchBotQueue.event';
import { TwitchBotQueueWorker } from './twitchBotQueue.worker';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'twitch-bot',
    }),
    TwitchFarmerApiModule,
    TwitchBotModule,
    RedisModule,
  ],
  providers: [TwitchBotQueueEvent, TwitchBotQueueWorker],
})
export class TwitchBotQueueModule {}
