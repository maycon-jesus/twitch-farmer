import { Controller, Get, Param, UseGuards, UsePipes } from '@nestjs/common';
import { MicroServiceGuard } from 'src/guards/microservice.guard';
import { IdsToNumberPipe } from 'src/pipes/IdsToNumber.pipe';
import { UserTwitchChannelsService } from '../UserTwitchChannels/userTwitchChannels.service';

@Controller('/private/users/:userId/twitch-channels')
@UsePipes(IdsToNumberPipe)
@UseGuards(MicroServiceGuard)
export class UserTwitchChannelsPrivateController {
  constructor(private userTwitchChannels: UserTwitchChannelsService) {}

  @Get()
  async getAllTwitchAccounts(@Param('userId') userId: number) {
    const allChannels = await this.userTwitchChannels.getUserChannels(userId);
    const allChannelsMapped = allChannels.map((c) => c.channel);
    return allChannelsMapped;
  }
}
