import { Module } from '@nestjs/common';
import { TwitchBotService } from './twitchBot.service';

@Module({
  providers: [TwitchBotService],
  exports: [TwitchBotService],
})
export class TwitchBotModule {}
