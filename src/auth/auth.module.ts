import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from '../users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { CommentsModule } from 'src/comments/comments.module';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      },
    }),
    TypeOrmModule.forFeature([UserEntity, UsersRepository]),
  ],
  exports: [AuthService, PassportModule, JwtStrategy],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, JwtRefreshTokenGuard, JwtStrategy],
})
export class AuthModule {}
