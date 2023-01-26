import { TwitchApiService } from './twitchApi.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [TwitchApiService],
  exports: [TwitchApiService],
})
export class TwitchApiModule {}
