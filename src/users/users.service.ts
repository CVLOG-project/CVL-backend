import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/entities/users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
}
