import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';
import {
  TwitchAccount,
  TwitchChannel,
  User,
} from 'src/modules/TwitchFarmerApi/twitchFarmerApi.service';

export interface JobLoadData {
  user: User;
}

export interface JobInitBotData extends JobLoadData {
  twitchChannels: TwitchChannel[];
  twitchAccounts: TwitchAccount[];
}

export interface JobLoadBotState {
  user: User;
  twitchAccount: TwitchAccount;
}

@Injectable()
export class TwitchBotQueueEvent {
  constructor(@InjectQueue('twitch-bot') private twitchBotQueue: Queue) {}

  pushJobToLoadData(data: JobLoadData) {
    this.twitchBotQueue.add('load-data', data);
  }

  pushJobToInitBot(data: JobInitBotData) {
    this.twitchBotQueue.add('init', data);
  }

  async pushJobLoadBotState(data: JobLoadBotState) {
    await this.twitchBotQueue.add('load-bot-state', data, {
      jobId: `twitch-bot-load-bot-state-${data.user.id}-${data.twitchAccount.id}`,
      repeatJobKey: `twitch-bot-load-bot-state-${data.user.id}-${data.twitchAccount.id}`,
      repeat: {
        every: 1000,
        immediately: true,
      },
    });
  }
}
