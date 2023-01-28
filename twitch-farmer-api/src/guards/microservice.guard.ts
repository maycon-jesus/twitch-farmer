import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type Express from 'express';

@Injectable()
export class MicroServiceGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const headerAuthorization = request.headers.authorization;
    if (!headerAuthorization) throw new NotFoundException();
    if (headerAuthorization !== process.env.MICROSERVICE_TOKEN)
      throw new NotFoundException();
    return true;
  }

  protected getRequest(context: ExecutionContext): Express.Request {
    return context.switchToHttp().getRequest();
  }
}
