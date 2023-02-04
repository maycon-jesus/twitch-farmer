import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/Auth/auth.module';
import { AuthGuardModule } from 'src/modules/AuthGuard/authGuard.module';
import { RedisModule } from 'src/modules/Redis/redis.module';
import { TwitchAccountBotController } from './twitchAccountBot.controller';
import { TwitchAccountBotService } from './twitchAccountBot.service';

@Module({
  imports: [RedisModule, AuthModule, AuthGuardModule],
  controllers: [TwitchAccountBotController],
  providers: [TwitchAccountBotService],
})
export class TwitchAccountBotModule {}
