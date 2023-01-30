import { TagEntity } from 'src/entities/tags.entity';
import { TagFolderRequestDto } from './tag_folder.request.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TagFoldersRepository } from './tag_folders.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagFoldersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly tagFoldersRepository: TagFoldersRepository,
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) {}

  async getAllFolder() {
    const user_id = 1;

    return await this.tagFoldersRepository.getAllFolder(user_id);
  }

  async createFolder(body: TagFolderRequestDto) {
    const { name } = body;
    const user_id = 1;

    const user = await this.usersRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException(`Can't find user with user_id: ${user_id}`);
    }

    const found = await this.tagFoldersRepository.getOneFolderByUserId(
      name,
      user,
    );

    if (found) {
      throw new BadRequestException(`${name} folder is already folder name`);
    }

    return await this.tagFoldersRepository.createFolder(name, user);
  }

  async updateFolder(id: number, body: TagFolderRequestDto) {
    const { name } = body;
    const user_id = 1;

    const user = await this.usersRepository.findOne({
      where: { id: user_id },
    });

    const found = await this.tagFoldersRepository.getOneFolderById(id, user);

    if (!found) {
      throw new NotFoundException(`Can't find tag folder with id: ${id}`);
    }

    return await this.tagFoldersRepository.updateFolder(id, name);
  }

  async deleteFolder(id: number) {
    const user_id = 1;

    const user = await this.usersRepository.findOne({
      where: { id: user_id },
    });

    const found = await this.tagFoldersRepository.getOneFolderById(id, user);

    if (!found) {
      throw new NotFoundException(`Can't find tag folder with id: ${id}`);
    }

    const foundRelations = await this.tagRepository.findAndCount({
      where: {
        folder_id: {
          id: id,
          user_id: {
            id: user.id,
          },
        },
      },
      relations: {
        folder_id: true,
      },
    });

    if (foundRelations[foundRelations.length - 1]) {
      throw new BadRequestException(`id:${id} Folder is not empty`);
    }

    return await this.tagFoldersRepository.deleteFolder(id);
  }
}
