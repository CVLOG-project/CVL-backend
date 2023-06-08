import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { UserEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const host = context.switchToHttp();
    const req = host.getRequest<Request>();

    const accessToken =
      typeof req.headers.authorization === 'string' &&
      /^Bearer/.test(req.headers.authorization)
        ? req.headers.authorization.split(' ')[1]
        : null;

    console.log(req);

    if (accessToken === null) {
      throw new UnauthorizedException('accessToken is null');
    }

    const payload = await this.authService.validationAccessToken(accessToken);

    const user = await this.usersRepository.findOne({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException(`id: ${payload.id} is not existent user`);
    }

    req.user = user;

    return true;
  }
}
