import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuardService } from 'src/modules/AuthGuard/authGuard.service';
import type Express from 'express';

@Injectable()
export abstract class GuardBase implements CanActivate {
  constructor(protected authGuardService: AuthGuardService) {}

  abstract process(request: Express.Request): Promise<boolean>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    return await this.process(request);
  }

  protected getRequest(context: ExecutionContext): Express.Request {
    return context.switchToHttp().getRequest();
  }
}
