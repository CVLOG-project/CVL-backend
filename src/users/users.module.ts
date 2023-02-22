import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { UsersRepository } from './users.repository';
import { TagFolderEntity } from 'src/entities/tagFolders.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UsersRepository, TagFolderEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
