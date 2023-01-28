import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { paramStringToNumber } from 'src/utils/paramStringToNumber';
import { GuardBase } from './base.guard';

export class UserHasTwitchAccountPermissionGuard extends GuardBase {
  async process(
    request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  ): Promise<boolean> {
    const userId = paramStringToNumber('userId', request.params.userId);
    const accountId = paramStringToNumber(
      'accountId',
      request.params.accountId,
    );
    return await this.authGuardService.userHasPermissionInTwitchAccount(
      userId,
      accountId,
    );
  }
}
