import { AwsService } from './aws.service';
import { UserEntity } from './../entities/users.entity';
import { TagEntity } from 'src/entities/tags.entity';
import { CategoryEntity } from './../entities/categories.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PostRequestDto } from './posts.request.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { PostEntity } from '../entities/posts.entity';
import { DataSource, Repository } from 'typeorm';
import { arraysEqualForTag } from 'src/common/functions/arraysEqualForTag';
import { FileEntity } from 'src/entities/files.entity';
import { arraysEqualForFile } from 'src/common/functions/arraysEqualForFile';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>,
    @InjectRepository(TagEntity)
    private tagsRepository: Repository<TagEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectDataSource()
    private dataSource: DataSource,
    private readonly postsRepository: PostsRepository,
    private readonly awsService: AwsService,
  ) {}

  async getAllPost() {
    const user_id = 1; //after complete jwt, insert decoding user_id

    return await this.postsRepository.getAllPost(user_id);
  }

  async getOnePost(id: number): Promise<PostEntity> {
    const found = await this.postsRepository.getOnePost(id);

    if (!found) {
      throw new NotFoundException(`Can't find post with id: ${id}`);
    }

    return found;
  }

  async createPost(body: PostRequestDto) {
    const { title, content, category_id, public_status, tags, files } = body;
    const user_id = 1;
    let concatTags: TagEntity[] = [];
    let concatFiles: FileEntity[] = [];

    const user = await this.usersRepository.findOne({
      where: { id: user_id },
    });

    const category = await this.categoriesRepository.findOne({
      where: { id: category_id },
    });

    if (!category) {
      throw new NotFoundException(
        `Can't find category with category_id: ${category_id}`,
      );
    }

    if (tags.length !== 0) {
      for (const tagName of tags) {
        const found = await this.dataSource
          .getRepository(TagEntity)
          .createQueryBuilder('tags')
          .leftJoin('tags.posts', 'posts')
          .where('posts.user_id = :user', { user: user.id })
          .andWhere('tags.name = :name', { name: tagName })
          .getOne();

        if (found) {
          concatTags = concatTags.concat(found);
        } else {
          const create = await this.tagsRepository.create({
            name: tagName,
          });
          await this.tagsRepository.save(create);

          concatTags = concatTags.concat(create);
        }
      }
    }

    if (files.length !== 0) {
      for (const fileUrl of files) {
        const key = this.awsService.getAwsS3FileKey(fileUrl);

        const found = await this.dataSource
          .getRepository(FileEntity)
          .createQueryBuilder('files')
          .where('files.key = :key', { key: key })
          .getOne();

        if (found) {
          concatFiles = concatFiles.concat(found);
        } else {
          throw new NotFoundException(
            `Can't find post with file URL : ${fileUrl}`,
          );
        }
      }
    }

    const result = await this.postsRepository.createPost(
      title,
      content,
      user_id,
      public_status,
      category,
      concatTags,
      concatFiles,
    );

    return result;
  }

  async updatePost(id: number, body: PostRequestDto) {
    const { title, content, tags, files } = body;
    const user_id = 1;
    let updateTags: TagEntity[] = [];
    let concatFiles: FileEntity[] = [];

    const found = await this.postsRepository.getOnePost(id);

    if (!found) {
      throw new NotFoundException(`Can't find post with id: ${id}`);
    }

    const user = await this.usersRepository.findOne({
      where: { id: user_id },
    });

    if (tags.length !== 0) {
      for (const tag_name of tags) {
        const found = await this.dataSource
          .getRepository(TagEntity)
          .createQueryBuilder('tags')
          .leftJoin('tags.posts', 'posts')
          .where('posts.user_id = :user', { user: user.id })
          .andWhere('tags.name = :name', { name: tag_name })
          .getOne();

        if (found) {
          updateTags = updateTags.concat(found);
        } else {
          const create = await this.tagsRepository.create({
            name: tag_name,
          });
          await this.tagsRepository.save(create);

          updateTags = updateTags.concat(create);
        }
      }
    }

    if (files.length !== 0) {
      for (const fileUrl of files) {
        const key = this.awsService.getAwsS3FileKey(fileUrl);

        const found = await this.dataSource
          .getRepository(FileEntity)
          .createQueryBuilder('files')
          .leftJoinAndSelect('files.post_id', 'post')
          .andWhere('files.key = :key', { key: key })
          .getOne();

        if (found.post_id !== null && found.post_id.user_id !== user.id) {
          throw new BadRequestException(
            `${fileUrl} file does not belong to id: ${user.id} user `,
          );
        }

        if (found) {
          concatFiles = concatFiles.concat(found);
        } else {
          throw new NotFoundException(
            `Can't find post with file URL : ${fileUrl}`,
          );
        }
      }
    }

    const modifyCheck = await this.postsRepository.getOnePost(id);

    if (
      modifyCheck.title === title &&
      modifyCheck.content === content &&
      arraysEqualForTag(updateTags, modifyCheck.tags) &&
      arraysEqualForFile(concatFiles, modifyCheck.files)
    ) {
      throw new BadRequestException('No modifications have been made');
    }

    if (concatFiles.length !== 0) {
      for (const file of concatFiles) {
        delete file.post_id;
      }
    }

    return await this.postsRepository.updatePost(
      id,
      title,
      content,
      updateTags,
      concatFiles,
    );
  }

  async updatePartialPost(id: number, public_status: boolean) {
    const found = await this.postsRepository.getOnePost(id);

    if (!found) {
      throw new NotFoundException(`Can't not find post with id: ${id}`);
    }

    if (found.public_status === public_status) {
      throw new BadRequestException(
        `Public_status is already an ${public_status}`,
      );
    }

    return await this.postsRepository.updatePartialPost(id, public_status);
  }

  async deletePost(id: number) {
    const result = await this.postsRepository.deletePost(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Can't not find post with id: ${id}`);
    }

    return result;
  }

  async uploadFile(key: string) {
    const found = await this.postsRepository.checkDuplicateFile(key);

    if (found) {
      throw new BadRequestException(`key: ${key} is duplicate`);
    }

    return await this.postsRepository.uploadFile(key);
  }
}
