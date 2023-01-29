import { UserTwitchChannelsController } from './userTwitchChannels.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitchChannelsModule } from '../TwitchChannels/TwitchChannels.module';
import { UserTwitchChannelsEntity } from './entities/userTwitchChannels.entity';
import { UserTwitchChannelsService } from './userTwitchChannels.service';
import { AuthModule } from '../Auth/auth.module';
import { AuthGuardModule } from '../AuthGuard/authGuard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTwitchChannelsEntity]),
    TwitchChannelsModule,
    AuthModule,
    AuthGuardModule,
  ],
  providers: [UserTwitchChannelsService],
  controllers: [UserTwitchChannelsController],
})
export class UserTwitchChannelsModule {}
