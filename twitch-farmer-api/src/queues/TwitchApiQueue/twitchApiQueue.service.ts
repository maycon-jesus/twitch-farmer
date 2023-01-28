import {
  InjectQueue,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { DateTime } from 'luxon';
import { CustomError } from 'src/utils/PromiseError';
import { OnEvent } from '@nestjs/event-emitter';
import { TwitchApiService } from 'src/modules/TwitchApi/twitchApi.service';
import { UserTwitchAccountsService } from 'src/modules/UserTwitchAccounts/userTwitchAccounts.service';

interface RefreshTokenData {
  accountId: number;
}

interface OnTwitchAccountCreatedData {
  accountId: number;
}

@Processor('twitch-api')
export class TwitchApiQueueService extends WorkerHost {
  constructor(
    private twitchApi: TwitchApiService,
    private twitchAccounts: UserTwitchAccountsService,
    @InjectQueue('twitch-api') private queueTwitchApi: Queue,
  ) {
    super();
  }

  @OnEvent('twitch-accounts.created')
  async onNewTwitchAccount(data: OnTwitchAccountCreatedData) {
    await this.queueTwitchApi.add(
      'validate-token',
      {
        accountId: data.accountId,
      },
      {
        repeatJobKey: 'validate.' + data.accountId,
        repeat: {
          every: 3000000,
          immediately: false,
        },
        jobId: 'validate.' + data.accountId,
      },
    );
  }

  @OnWorkerEvent('ready')
  async queueAllAccounts() {
    const accounts = await this.twitchAccounts.getAll({
      where: {
        tokenStatus: 'authorized',
      },
    });
    accounts.forEach(async (account) => {
      await this.queueTwitchApi.add(
        'validate-token',
        {
          accountId: account.id,
        },
        {
          repeat: {
            every: 3000000,
            immediately: true,
          },
          repeatJobKey: 'validate.' + account.id,
          jobId: 'validate.' + account.id,
        },
      );
    });
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'refresh-token') {
      await this.refreshToken(job);
    } else if (job.name === 'validate-token') {
      await this.validateToken(job);
    }
  }

  protected async refreshToken(job: Job<RefreshTokenData, any, string>) {
    const data = job.data;
    const account = await this.twitchAccounts.getOne({
      id: data.accountId,
    });
    if (!account) throw new Error('Conta não encontrada!');

    const refreshData = await this.twitchApi.refreshToken(account.refreshToken);
    if (refreshData instanceof CustomError) {
      if (refreshData.code === 'REFRESH_TOKEN_INVALID') {
        await this.twitchAccounts.update(
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

    await this.twitchAccounts.update(
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

  protected async validateToken(job: Job<RefreshTokenData, any, string>) {
    const data = job.data;
    const account = await this.twitchAccounts.getOne({
      id: data.accountId,
    });
    if (!account) {
      await this.queueTwitchApi.removeRepeatableByKey(job.repeatJobKey);
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
      await this.queueTwitchApi.add(
        'refresh-token',
        {
          accountId: account.id,
        },
        {
          parent: jobParent,
        },
      );
    } else {
      try {
        await this.twitchApi.validateToken(account.accessToken);
      } catch {
        console.log('erro validacao');
        await this.queueTwitchApi.add(
          'refresh-token',
          {
            accountId: account.id,
          },
          {
            parent: jobParent,
          },
        );
      }
    }
  }
}
