import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import type Express from 'express';
import { SessionData } from 'src/@types/sessionData';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = this.getRequest(context);

    const authorization = request.headers.authorization;
    if (!authorization)
      throw new HttpException('Credencial de acesso inválida', 403);

    const payload = this.getPayload(authorization);

    if (request.params.userId == 'me')
      request.params.userId = payload.sub.toString();

    // if (
    //   request.params.userId &&
    //   payload.sub.toString() != request.params.userId
    // )
    //   throw new ForbiddenException();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    request.session = payload;

    return true;
  }

  protected getRequest(context: ExecutionContext): Express.Request {
    return context.switchToHttp().getRequest();
  }

  getPayload(token: string): SessionData {
    try {
      const payload = this.jwtService.verify(token);
      payload.sub = Number(payload.sub);
      return payload;
    } catch {
      throw new HttpException('Credencial de acesso inválida', 403);
    }
  }
}
