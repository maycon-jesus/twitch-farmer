import {
  Controller,
  Get,
  HttpCode,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserHasTwitchAccountPermissionGuard } from 'src/guards/userHasTwitchAccountPermission.guard';
import { IdsToNumberPipe } from 'src/pipes/IdsToNumber.pipe';
import { TwitchAccountBotService } from './twitchAccountBot.service';

@Controller('/users/:userId/twitch-accounts/:accountId/bot')
@UseGuards(AuthGuard, UserHasTwitchAccountPermissionGuard)
export class TwitchAccountBotController {
  constructor(private twitchAccountBot: TwitchAccountBotService) {}

  @Get('/')
  @HttpCode(200)
  @UsePipes(IdsToNumberPipe)
  async getBotInfo(
    @Param('userId') userId: number,
    @Param('accountId') accountId: number,
  ) {
    return await this.twitchAccountBot.getBotInfo(userId, accountId);
  }
}
