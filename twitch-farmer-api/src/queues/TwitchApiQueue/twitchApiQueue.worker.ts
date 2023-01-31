import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DateTime } from 'luxon';
import { TwitchApiService } from 'src/modules/TwitchApi/twitchApi.service';
import { UserTwitchAccountsService } from 'src/modules/UserTwitchAccounts/userTwitchAccounts.service';
import { CustomError } from 'src/utils/PromiseError';
import {
  TwitchApiQueueEvent,
  TwitchQueueRefreshTokenData,
  TwitchQueueValidateTokenData,
} from './twitchApiQueue.event';

@Processor('twitch-api')
export class TwitchApiQueueWorker extends WorkerHost {
  constructor(
    private twitchApiQueueEvent: TwitchApiQueueEvent,
    private userTwitchAccounts: UserTwitchAccountsService,
    private twitchApi: TwitchApiService,
  ) {
    super();
  }

  @OnWorkerEvent('ready')
  async queueAllAccounts() {
    const accounts = await this.userTwitchAccounts.getAll({
      where: {
        tokenStatus: 'authorized',
      },
    });
    accounts.forEach(async (account) => {
      await this.twitchApiQueueEvent.pushToQueueValidateToken({
        accountId: account.id,
      });
    });
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log('process');
    if (job.name === 'refresh-token') {
      await this.refreshToken(job);
    } else if (job.name === 'validate-token') {
      await this.validateToken(job);
    }
  }

  protected async refreshToken(
    job: Job<TwitchQueueRefreshTokenData, any, string>,
  ) {
    const data = job.data;
    const account = await this.userTwitchAccounts.getOne({
      id: data.accountId,
    });
    if (!account) throw new Error('Conta não encontrada!');

    const refreshData = await this.twitchApi.refreshToken(account.refreshToken);
    if (refreshData instanceof CustomError) {
      if (refreshData.code === 'REFRESH_TOKEN_INVALID') {
        await this.userTwitchAccounts.update(
          {
            tokenStatus: 'unauthorized',
          },
          {
            id: job.data.accountId,
          },
        );
      }

      return;
    }

    const validateData = await this.twitchApi.validateToken(
      refreshData.accessToken,
    );

    if (validateData instanceof CustomError) {
      if (validateData.code === 'ACCESS_TOKEN_INVALID') {
        await this.userTwitchAccounts.update(
          {
            tokenStatus: 'unauthorized',
          },
          {
            id: job.data.accountId,
          },
        );
      }
      return;
    }

    await this.userTwitchAccounts.update(
      {
        accessToken: refreshData.accessToken,
        refreshToken: refreshData.refreshToken,
        tokenExpiresAt: validateData.expiresAt,
      },
      {
        id: data.accountId,
      },
    );
  }

  protected async validateToken(
    job: Job<TwitchQueueValidateTokenData, any, string>,
  ) {
    const data = job.data;
    const account = await this.userTwitchAccounts.getOne({
      id: data.accountId,
    });
    if (!account) {
      await this.twitchApiQueueEvent.removeRepeatableJobByKey(job.repeatJobKey);
      return;
    }

    const horasRestantes = DateTime.fromJSDate(account.tokenExpiresAt)
      .diffNow('hour')
      .toObject();

    const jobParent = job.parent
      ? {
          queue: job.parent.queueKey,
          id: job.parent.id,
        }
      : undefined;

    if (horasRestantes.hours < 1) {
      await this.twitchApiQueueEvent.pushToQueueRefreshToken(
        {
          accountId: account.id,
        },
        { parent: jobParent },
      );
    } else {
      const tokenValidation = await this.twitchApi.validateToken(
        account.accessToken,
      );
      if (tokenValidation instanceof CustomError) {
        if (tokenValidation.code === 'ACCESS_TOKEN_INVALID') {
          await this.twitchApiQueueEvent.pushToQueueRefreshToken(
            {
              accountId: account.id,
            },
            { parent: jobParent },
          );
        }
        return;
      }
    }
  }
}
