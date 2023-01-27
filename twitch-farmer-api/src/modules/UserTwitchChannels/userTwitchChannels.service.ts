import { UserTwitchChannelsEntity } from './entities/userTwitchChannels.entity';
import { TwitchChannelsService } from '../TwitchChannels/TwitchChannels.service';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserTwitchChannelsService {
  constructor(
    @InjectRepository(UserTwitchChannelsEntity)
    private userTwitchChannelRepository: Repository<UserTwitchChannelsEntity>,
    private twitchChannelsService: TwitchChannelsService,
  ) {}

  async getRelation(userId: number, channelId: number) {
    const relation = await this.userTwitchChannelRepository.findOne({
      where: {
        userId,
        channelId,
      },
    });
    return relation;
  }

  async insert(data: { userId: number; channelUsername: string }) {
    const channel = await this.twitchChannelsService.getChannelInfoAndInsert({
      username: data.channelUsername,
    });
    const channelRelationExists = await this.getRelation(
      data.userId,
      channel.id,
    );
    if (channelRelationExists)
      throw new HttpException('Você já possui este canal adicionado', 500);

    await this.userTwitchChannelRepository.insert({
      user: {
        id: data.userId,
      },
      channel: {
        id: channel.id,
      },
    });

    return {
      username: channel.username,
      id: channel.id,
    };
  }
}
