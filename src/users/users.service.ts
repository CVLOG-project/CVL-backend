import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/entities/users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserInfo(id: number): Promise<UserEntity> {
    const found = this.usersRepository.getOneUserById(id);

    if (!found) {
      throw new NotFoundException(`Can't find user with id: ${id}`);
    }

    return found;
  }
}
