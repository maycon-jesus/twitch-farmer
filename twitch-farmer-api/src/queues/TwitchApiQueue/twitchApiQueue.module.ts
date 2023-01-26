import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TwitchApiQueueService } from './twitchApiQueue.service';
import { TwitchAccountsModule } from 'src/modules/TwitchAccounts/twitchAccounts.module';
import { TwitchApiModule } from 'src/modules/TwitchApi/twitchApi.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'twitch-api',
    }),
    TwitchAccountsModule,
    TwitchApiModule,
  ],
  providers: [TwitchApiQueueService],
  exports: [],
})
export class TwitchApiQueueModule {}
