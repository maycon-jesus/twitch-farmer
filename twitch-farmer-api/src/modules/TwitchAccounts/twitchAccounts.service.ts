import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { TwitchAccountEntity } from './entities/twitchAccount.entity';
import { TwitchApiService } from '../TwitchApi/twitchApi.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class TwitchAccountsService {
  constructor(
    @InjectRepository(TwitchAccountEntity)
    private twitchAccounts: Repository<TwitchAccountEntity>,
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

  async getOne(where: FindOptionsWhere<TwitchAccountEntity>) {
    const account = await this.twitchAccounts.findOne({
      where,
    });
    return account;
  }

  async update(
    data: QueryDeepPartialEntity<TwitchAccountEntity>,
    where: FindOptionsWhere<TwitchAccountEntity>,
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
    });

    return {
      id: nAccount.id,
    };
  }
}
