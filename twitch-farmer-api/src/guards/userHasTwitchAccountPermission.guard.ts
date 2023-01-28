import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { stringToNumberTransformer } from 'src/utils/transformers/stringToNumber';
import { GuardBase } from './base.guard';

export class UserHasTwitchAccountPermissionGuard extends GuardBase {
  async process(
    request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  ): Promise<boolean> {
    const userId = stringToNumberTransformer('userId', request.params.userId);
    const accountId = stringToNumberTransformer(
      'accountId',
      request.params.accountId,
    );
    return await this.authGuardService.userHasPermissionInTwitchAccount(
      userId,
      accountId,
    );
  }
}
