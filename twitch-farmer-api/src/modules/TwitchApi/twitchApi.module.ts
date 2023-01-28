import { TwitchApiService } from './twitchApi.service';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'twitch-api',
    }),
  ],
  providers: [TwitchApiService],
  exports: [TwitchApiService],
})
export class TwitchApiModule {
  constructor() {
    console.log('alooooooooooooooo');
  }
}
