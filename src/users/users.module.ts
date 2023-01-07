import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UsersRepository]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
