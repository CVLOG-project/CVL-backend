import { TagFoldersRepository } from 'src/tag_folders/tag_folders.repository';
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
import { TagFolderEntity } from 'src/entities/tagFolders.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly tagsRepository: TagsRepository,
    @InjectRepository(TagFolderEntity)
    private tagFolderRepository: Repository<TagFolderEntity>,
    private tagFoldersRepository: TagFoldersRepository,
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

    const found = await this.tagsRepository.getOneTagByName(user, name);

    if (found) {
      throw new BadRequestException(`${name} tag is already tag name`);
    }

    return await this.tagsRepository.createTag(name);
  }

  async updateTag(user_id: number, tag_id: number, folder_id: number) {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException(`Can't find user with user_id: ${user_id}`);
    }

    const foundTag = await this.tagsRepository.getOneTagById(user, tag_id);

    if (!foundTag) {
      throw new BadRequestException(`Can't find tag with tag_id: ${tag_id}`);
    }

    const foundFolder = await this.tagFoldersRepository.getOneFolderById(
      folder_id,
      user,
    );

    if (!foundFolder) {
      throw new BadRequestException(
        `Can't find folder with folder_id: ${folder_id}`,
      );
    }

    return await this.tagsRepository.updateTag(tag_id, folder_id);
  }
}
