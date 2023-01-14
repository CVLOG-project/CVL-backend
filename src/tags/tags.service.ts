import { TagRequestDto } from './tag.request.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { TagsRepository } from './tags.repository';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly tagsRepository: TagsRepository,
  ) {}

  async getAllTag(user_id) {
    return await this.tagsRepository.getAllTag(user_id);
  }

  async createTag(user_id: number, body: TagRequestDto) {
    const { name } = body;
    const user = await this.userRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException(`Can't find user with user_id: ${user_id}`);
    }

    const found = await this.tagsRepository.getOneTag(user, name);
    console.log(user);
    console.log(found);

    return found;

    if (found) {
      throw new BadRequestException(`${name} tag is already tag name`);
    }

    return await this.tagsRepository.createTag(name);
  }
}
