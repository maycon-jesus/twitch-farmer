import { UserTwitchAccountsService } from './../../modules/UserTwitchAccounts/userTwitchAccounts.service';
import { TwitchApiService } from './../../modules/TwitchApi/twitchApi.service';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DateTime } from 'luxon';

interface RefreshTokenData {
  accountId: number;
}

@Processor('twitch-api')
export class TwitchApiQueueService extends WorkerHost {
  constructor(
    private twitchApi: TwitchApiService,
    private twitchAccounts: UserTwitchAccountsService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log('aaaa', job.name);
    if (job.name === 'refresh-token') {
      console.log('bbbb');
      await this.refreshToken(job.data);
      console.log(this.twitchApi.validateToken);
    }
    // console.log(job, token);
  }

  protected async refreshToken(data: RefreshTokenData) {
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
