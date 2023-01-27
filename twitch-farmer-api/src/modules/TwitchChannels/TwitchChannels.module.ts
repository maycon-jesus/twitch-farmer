import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitchApiModule } from '../TwitchApi/twitchApi.module';
import { UserTwitchAccountsModule } from '../UserTwitchAccounts/userTwitchAccounts.module';
import { TwitchChannelEntity } from './entities/twitchChannel.entity';
import { TwitchChannelsService } from './TwitchChannels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TwitchChannelEntity]),
    TwitchApiModule,
    UserTwitchAccountsModule,
  ],
  providers: [TwitchChannelsService],
  exports: [TwitchChannelsService],
})
export class TwitchChannelsModule {}
