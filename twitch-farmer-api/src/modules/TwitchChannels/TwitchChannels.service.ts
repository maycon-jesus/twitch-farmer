import { UserTwitchAccountsService } from './../UserTwitchAccounts/userTwitchAccounts.service';
import { TwitchChannelEntity } from './entities/twitchChannel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TwitchApiService } from '../TwitchApi/twitchApi.service';

@Injectable()
export class TwitchChannelsService {
  constructor(
    @InjectRepository(TwitchChannelEntity)
    private twitchChannelsRepository: Repository<TwitchChannelEntity>,
    private twitchApiService: TwitchApiService,
    private userTwitchAccountsService: UserTwitchAccountsService,
  ) {}

  async getOne(where: FindOptionsWhere<TwitchChannelEntity>) {
    const channel = await this.twitchChannelsRepository.findOne({
      where,
    });
    return channel;
  }

  async insert(data: {
    username: string;
    avatarUrl: string;
    twitchUserId: string;
    displayName: string;
  }) {
    data.username = data.username.toLowerCase();

    const {
      identifiers: [nChannel],
    } = await this.twitchChannelsRepository.insert({
      username: data.username,
      avatarUrl: data.avatarUrl,
      twitchUserId: data.twitchUserId,
      displayName: data.displayName,
    });
    return {
      channelId: nChannel.id,
    };
  }

  async getChannelInfoAndInsert(data: { username: string }) {
    data.username = data.username.toLowerCase();

    const channelExists = await this.getOne({
      username: data.username,
    });
    if (channelExists) return channelExists;
    const token = await this.userTwitchAccountsService.getRandomAccessToken();

    const streamerInfo = await this.twitchApiService.getStreamerInfo(
      data.username,
      token.accessToken,
    );

    await this.insert({
      avatarUrl: streamerInfo.avatarUrl,
      twitchUserId: streamerInfo.id,
      username: streamerInfo.login,
      displayName: streamerInfo.displayName,
    });

    const channel = await this.getOne({
      username: data.username,
    });
    return channel;
  }
}
