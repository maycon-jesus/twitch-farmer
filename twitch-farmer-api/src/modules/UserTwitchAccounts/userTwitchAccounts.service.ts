import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserTwitchAccountEntity } from './entities/userTwitchAccount.entity';
import { TwitchApiService } from '../TwitchApi/twitchApi.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class UserTwitchAccountsService {
  constructor(
    @InjectRepository(UserTwitchAccountEntity)
    private twitchAccounts: Repository<UserTwitchAccountEntity>,
    private twitchApiService: TwitchApiService,
  ) {}

  async getByTwitchUserId(twitchUserId: string) {
    const account = await this.twitchAccounts.findOne({
      where: {
        twitchUserId,
      },
    });
    return account;
  }

  async getOne(where: FindOptionsWhere<UserTwitchAccountEntity>) {
    const account = await this.twitchAccounts.findOne({
      where,
    });
    return account;
  }

  async getRandomAccessToken() {
    const account = await this.twitchAccounts.findOne({
      where: {
        tokenStatus: 'authorized',
      },
      order: {
        tokenExpiresAt: {
          direction: 'desc',
        },
      },
    });

    if (!account)
      throw new HttpException(
        'Nenhuma conta elegivel para obter informações do canal',
        500,
      );

    return {
      accessToken: account.accessToken,
    };
  }

  async update(
    data: QueryDeepPartialEntity<UserTwitchAccountEntity>,
    where: FindOptionsWhere<UserTwitchAccountEntity>,
  ) {
    await this.twitchAccounts.update(where, data);
  }

  async insert(accountData: { code: string; owner: number }) {
    const tokens = await this.twitchApiService.exchangeCodeToTokens(
      accountData.code,
    );
    const validateToken = await this.twitchApiService.validateToken(
      tokens.accessToken,
    );
    const userData = await this.twitchApiService.getAccountInfoById(
      validateToken.userId,
      tokens.accessToken,
    );

    const userAlreadyExists = await this.getByTwitchUserId(userData.id);
    if (userAlreadyExists)
      throw new HttpException(`Essa conta ja esta registrada no sistema`, 400);

    const {
      identifiers: [nAccount],
    } = await this.twitchAccounts.insert({
      username: userData.login,
      avatarUrl: userData.avatarUrl,
      twitchUserId: userData.id,
      email: userData.email,
      owner: {
        id: accountData.owner,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenExpiresAt: validateToken.expiresAt,
      tokenStatus: 'authorized',
    });

    return {
      id: nAccount.id,
    };
  }
}
