import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

export interface TwitchQueueRefreshTokenData {
  accountId: number;
}

export interface TwitchQueueValidateTokenData {
  accountId: number;
}

@Injectable()
export class TwitchApiQueueEvent {
  constructor(@InjectQueue('twitch-api') private queueTwitchApi: Queue) {}

  async pushToQueueRefreshToken(
    data: TwitchQueueRefreshTokenData,
    opts?: {
      parent?: {
        queue: string;
        id: string;
      };
    },
  ) {
    await this.queueTwitchApi.add('refresh-token', data, {
      parent: opts?.parent,
    });
  }

  async pushToQueueValidateToken(data: TwitchQueueValidateTokenData) {
    await this.queueTwitchApi.add('validate-token', data, {
      repeatJobKey: 'validate.' + data.accountId,
      repeat: {
        every: 3000000,
        immediately: false,
      },
      jobId: 'validate.' + data.accountId,
    });
  }

  async removeRepeatableJobByKey(jobRepeatKey: string) {
    await this.queueTwitchApi.removeRepeatableByKey(jobRepeatKey);
  }
}
