import { UserTwitchChannelsService } from './userTwitchChannels.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Session,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { SessionData } from 'src/@types/sessionData';
import { insertTwitchChannelDto } from './dto/insertTwitchChannel.dto';
import { IdsToNumberPipe } from 'src/pipes/IdsToNumber.pipe';

@Controller('users/:userId/twitch-channels')
@UseGuards(AuthGuard)
export class UserTwitchChannelsController {
  constructor(private userTwitchChannelsService: UserTwitchChannelsService) {}

  @Get()
  @UsePipes(IdsToNumberPipe)
  @HttpCode(200)
  async listUserChannels(@Param('userId') userId: number) {
    const channels = await this.userTwitchChannelsService.getUserChannels(
      userId,
    );
    const channelFilter = channels.map((channel) => {
      return {
        id: channel.channel.id,
        username: channel.channel.username,
        displayName: channel.channel.displayName,
        avatarUrl: channel.channel.avatarUrl,
        createdAt: channel.channel.createdAt,
        updatedAt: channel.channel.updatedAt,
      };
    });
    return channelFilter;
  }

  @Post()
  @HttpCode(200)
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

  @Get(':channelId')
  @HttpCode(200)
  @UsePipes(IdsToNumberPipe)
  async getChannelDetails(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
  ) {
    const relation = await this.userTwitchChannelsService.getRelation(
      userId,
      channelId,
    );
    return {
      id: relation.channel.id,
      username: relation.channel.username,
      displayName: relation.channel.displayName,
      avatarUrl: relation.channel.avatarUrl,
      createdAt: relation.channel.createdAt,
      updatedAt: relation.channel.updatedAt,
    };
  }

  @Delete(':channelId')
  @HttpCode(200)
  @UsePipes(IdsToNumberPipe)
  async deleteChannel(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
  ) {
    await this.userTwitchChannelsService.deleteChannel({
      userId,
      channelId,
    });
    return;
  }
}
