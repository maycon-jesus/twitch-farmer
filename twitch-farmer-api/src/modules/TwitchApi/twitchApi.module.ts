import { TwitchApiService } from './twitchApi.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [TwitchApiService],
  exports: [TwitchApiService],
})
export class TwitchApiModule {}
