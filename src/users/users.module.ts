import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret:'Secret1234',
			signOptions:{
				expiresIn: 60 * 60
			}
		}),
		TypeOrmModule.forFeature([UserEntity,UsersRepository])],
	exports: [UserService, JwtStrategy, PassportModule],
	controllers: [UserController],
	providers: [UserService, UsersRepository, JwtStrategy]
})
export class UsersModule {}