import { AwsService } from './aws.service';
import { UserEntity } from './../entities/users.entity';
import { TagEntity } from 'src/entities/tags.entity';
import { CategoryEntity } from './../entities/categories.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PostRequestDto } from './posts.request.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { DataSource, Repository } from 'typeorm';
import { arraysEqualForTag } from 'src/common/functions/arraysEqualForTag';
import { FileEntity } from 'src/entities/files.entity';
import { arraysEqualForFile } from 'src/common/functions/arraysEqualForFile';
import { TagFoldersRepository } from 'src/tag_folders/tag_folders.repository';

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
    private readonly tagfoldersrepository: TagFoldersRepository,
  ) {}

  async getAllPost(user: UserEntity, page: number) {
    const PAGE_SIZE = 10;

    const CountPost = await this.postsRepository.getAllPostCount(user);

    const maxPage = Math.floor(CountPost / 10) + 1;

    if (page <= 0 || maxPage < page) {
      throw new BadRequestException(`page: ${page} is invalid`);
    }

    const result = await this.postsRepository.getAllPost(user, page, PAGE_SIZE);

    return { posts: result, maxPage };
  }

  async getOnePost(user: UserEntity, id: number) {
    const found = await this.postsRepository.getOnePost(id);

    if (!found) {
      throw new NotFoundException(`Can't find post with id: ${id}`);
    }

    if (found.user_id.id !== user.id) {
      throw new BadRequestException(`Post details are visible only to owner`);
    }

    const prevPost = await this.postsRepository.getPrevPost(user, found);
    const nextPost = await this.postsRepository.getNextPost(user, found);

    const result = {
      post: found,
      prevPostInfo: prevPost
        ? { id: prevPost.id, title: prevPost.title }
        : null,
      nextPostInfo: nextPost
        ? { id: nextPost.id, title: nextPost.title }
        : null,
    };

    return result;
  }

  async createPost(body: PostRequestDto, user: UserEntity) {
    const { title, content, category_id, public_status, tags, files } = body;

    let concatTags: TagEntity[] = [];
    let concatFiles: FileEntity[] = [];

    const category = await this.categoriesRepository.findOne({
      where: { id: category_id },
    });

    if (!category) {
      throw new NotFoundException(
        `Can't find category with category_id: ${category_id}`,
      );
    }

    if (tags.length !== 0) {
      const findDefaultFolder =
        await this.tagfoldersrepository.getOneFolderByUserId('', user);

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
          create.folder_id = findDefaultFolder;
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
      user,
      public_status,
      category,
      concatTags,
      concatFiles,
    );

    return result;
  }

  async updatePost(id: number, body: PostRequestDto, user: UserEntity) {
    const { title, content, tags, files } = body;

    let updateTags: TagEntity[] = [];
    let concatFiles: FileEntity[] = [];

    const found = await this.postsRepository.getOnePost(id);

    if (!found) {
      throw new NotFoundException(`Can't find post with id: ${id}`);
    }

    if (tags.length !== 0) {
      const findDefaultFolder =
        await this.tagfoldersrepository.getOneFolderByUserId('', user);

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
          create.folder_id = findDefaultFolder;
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

        if (found.post_id !== null && found.post_id.user_id !== user) {
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
    const post = await this.postsRepository.getOnePost(id);

    if (!post) {
      throw new NotFoundException(`Post with id: ${id} not found.`);
    }

    const tagId = post.tags.map((tag) => tag.id);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.postsRepository.deletePost(id);

      if (tagId.length !== 0) {
        for (const id of tagId) {
          await this.tagsRepository.delete({ id });
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw new ConflictException(`delete transaction error`);
    } finally {
      await queryRunner.release();

      return 'delete success';
    }
  }

  async uploadFile(key: string) {
    const found = await this.postsRepository.checkDuplicateFile(key);

    if (found) {
      throw new BadRequestException(`key: ${key} is duplicate`);
    }

    return await this.postsRepository.uploadFile(key);
  }
}
