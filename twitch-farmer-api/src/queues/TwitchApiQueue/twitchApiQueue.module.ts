import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TwitchApiQueueService } from './twitchApiQueue.service';
import { TwitchApiModule } from 'src/modules/TwitchApi/twitchApi.module';
import { UserTwitchAccountsModule } from 'src/modules/UserTwitchAccounts/userTwitchAccounts.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'twitch-api',
    }),
    UserTwitchAccountsModule,
    TwitchApiModule,
  ],
  providers: [TwitchApiQueueService],
  exports: [],
})
export class TwitchApiQueueModule {}
