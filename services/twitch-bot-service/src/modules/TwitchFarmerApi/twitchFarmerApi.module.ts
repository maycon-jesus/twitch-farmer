import { Module } from '@nestjs/common';
import { TwitchFarmerApiService } from './twitchFarmerApi.service';

@Module({
  providers: [TwitchFarmerApiService],
  exports: [TwitchFarmerApiService],
})
export class TwitchFarmerApiModule {}
