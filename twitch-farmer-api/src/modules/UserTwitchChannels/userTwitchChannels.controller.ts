import { UserTwitchChannelsService } from './userTwitchChannels.service';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { SessionData } from 'src/@types/sessionData';
import { insertTwitchChannelDto } from './dto/insertTwitchChannel.dto';

@Controller('twitch-channels')
export class UserTwitchChannelsController {
  constructor(private userTwitchChannelsService: UserTwitchChannelsService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async insert(
    @Session() session: SessionData,
    @Body() body: insertTwitchChannelDto,
  ) {
    const channel = await this.userTwitchChannelsService.insert({
      userId: session.sub,
      channelUsername: body.username,
    });
    return {
      id: channel.id,
    };
  }
}
