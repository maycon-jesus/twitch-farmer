import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;
    if (!authorization)
      throw new HttpException('Credencial de acesso inválida', 403);

    const payload = this.getPayload(authorization);
    request.session = payload;

    return true;
  }

  getPayload(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      payload.sub = Number(payload.sub);
      return payload;
    } catch {
      throw new HttpException('Credencial de acesso inválida', 403);
    }
  }
}
