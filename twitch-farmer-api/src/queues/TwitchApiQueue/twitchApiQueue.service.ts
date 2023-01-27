import { UserTwitchAccountsService } from './../../modules/UserTwitchAccounts/userTwitchAccounts.service';
import { TwitchApiService } from './../../modules/TwitchApi/twitchApi.service';
import {
  InjectQueue,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { DateTime } from 'luxon';

interface RefreshTokenData {
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

  @OnWorkerEvent('ready')
  async queueAllAccounts() {
    const accounts = await this.twitchAccounts.getAll({
      where: {
        tokenStatus: 'authorized',
      },
    });
    accounts.forEach((account) => {
      this.queueTwitchApi.add(
        'refresh-token',
        {
          accountId: account.id,
        },
        {
          repeatJobKey: 'refresh.' + account.id,
          repeat: {
            every: 3000000,
            immediately: true,
          },
          jobId: 'refresh.' + account.id,
        },
      );
    });
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'refresh-token') {
      await this.refreshToken(job);
    }
  }

  protected async refreshToken(job: Job<RefreshTokenData, any, string>) {
    const data = job.data;
    const account = await this.twitchAccounts.getOne({
      id: data.accountId,
    });
    if (!account) throw new Error('Conta não encontrada!');

    const refreshData = await this.twitchApi.refreshToken(account.refreshToken);
    const validateData = await this.twitchApi.validateToken(
      refreshData.accessToken,
    );

    const horasRestantes = DateTime.fromJSDate(account.tokenExpiresAt)
      .diffNow('hour')
      .toObject();

    if (horasRestantes.hours < 1) {
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
  }

  @OnWorkerEvent('error')
  protected async onRefreshTokenFail(job: Job<any, any, string>) {
    if (job.name === 'refresh-token') {
      await this.twitchAccounts.update(
        {
          tokenStatus: 'unauthorized',
        },
        {
          id: job.data.accountId,
        },
      );
    }
  }
}
