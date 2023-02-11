import { UserEntity } from '../entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  
  async createUser(
    name: string,
    github_id: string,
    refresh_token: string | null,
    description: string,
    profile_image: string
  ) {
    const user = this.usersRepository.create({
      name,
      github_id,
      refresh_token,
      description,
      profile_image
    });
    
    await this.usersRepository.save(user);
    
    return user;
  }

  async getOneUserByGithubId( github_id: string ) {
    return await this.usersRepository.findOne({
      where: {
        github_id,
      },
    });
  }

  async getOneUserById( id: number ) {
    return await this.usersRepository.findOne({
      where: { 
        id,
      }
    });
  }

  async updateRefreshTokenInUser(id: number, refresh_token: string) {
    return await this.usersRepository.update({ id }, {
      refresh_token
    });
  }

  async deleteRefreshTokenInUser(id: number, refresh_token) {
    return await this.usersRepository.update({ id }, {
      refresh_token: null
    });
  }
}
