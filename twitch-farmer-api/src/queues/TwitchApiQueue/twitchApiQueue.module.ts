import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TwitchApiModule } from 'src/modules/TwitchApi/twitchApi.module';
import { UserTwitchAccountsModule } from 'src/modules/UserTwitchAccounts/userTwitchAccounts.module';
import { TwitchApiQueueEvent } from './twitchApiQueue.event';
import { TwitchApiQueueWorker } from './twitchApiQueue.worker';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'twitch-api',
    }),
    UserTwitchAccountsModule,
    TwitchApiModule,
  ],
  providers: [TwitchApiQueueEvent, TwitchApiQueueWorker],
  exports: [],
})
export class TwitchApiQueueModule {}
