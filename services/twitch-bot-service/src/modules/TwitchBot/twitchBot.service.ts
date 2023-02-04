import { Injectable } from '@nestjs/common';
import { CustomError } from 'src/utils/CustomError';
import * as tmi from 'tmi.js';
import {
  TwitchAccount,
  TwitchChannel,
  User,
} from '../TwitchFarmerApi/twitchFarmerApi.service';

interface InitBotData {
  user: User;
  twitchChannels: TwitchChannel[];
  twitchAccount: TwitchAccount;
}

interface TwitchBot {
  client: tmi.Client;
  user: User;
  twitchAccount: TwitchAccount;
  twitchChannels: TwitchChannel[];
}

@Injectable()
export class TwitchBotService {
  private bots: TwitchBot[] = [];

  private botExists(userId: number, accountId: number) {
    const bot = this.bots.find((bot) => {
      return bot.user.id === userId && bot.twitchAccount.id === accountId;
    });
    return !!bot;
  }

  async insertBot(twitchBot: TwitchBot) {
    this.bots.push(twitchBot);
  }

  async initBot(initBotData: InitBotData) {
    if (this.botExists(initBotData.user.id, initBotData.twitchAccount.id))
      throw new Error('Bot already exists');
    const channelsStringArr = initBotData.twitchChannels.map((c) => c.username);

    const client = new tmi.Client({
      identity: {
        username: initBotData.twitchAccount.username,
        password: initBotData.twitchAccount.accessToken,
      },
      connection: {
        reconnect: true,
        maxReconnectAttempts: Infinity,
        maxReconnectInterval: 30000,
        reconnectDecay: 1,
        reconnectInterval: 1000,
      },
      channels: channelsStringArr,
    });
    await client.connect();
    await this.insertBot({
      client,
      twitchAccount: initBotData.twitchAccount,
      twitchChannels: initBotData.twitchChannels,
      user: initBotData.user,
    });
  }

  async getBotState(userId: number, accountId: number) {
    const botData = this.bots.find((bot) => {
      return bot.user.id === userId && bot.twitchAccount.id === accountId;
    });
    if (!botData)
      return new CustomError<'BOT_NOT_FOUND'>(new Error('Bot não encontrado'), {
        code: 'BOT_NOT_FOUND',
      });

    return {
      readyState: botData.client.readyState(),
      channels: botData.client.getChannels(),
    };
  }
}
