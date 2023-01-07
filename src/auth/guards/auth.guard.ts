import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService
  ){}

  async canActivate(context: ExecutionContext):Promise<boolean> {
    const host = context.switchToHttp();
    const req = host.getRequest<Request>();

    const accessToken = typeof req.headers.authorization === 'string' &&
     /^Bearer/.test(req.headers.authorization)
    ? req.headers.authorization.split(' ')[1]
    : null;

    if ( accessToken === null ){
      throw new UnauthorizedException('accessToken is null');
    }

    const payload = await this.authService.validationAccessToken(accessToken);
    req.user = payload.id;
    
    return true;
  }
}
