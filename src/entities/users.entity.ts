import { TagFolderEntity } from './tagFolders.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { PostEntity } from './posts.entity';
import { CommentEntity } from './comments.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  github_id: string;

  @Column('varchar', { length: 50, nullable: true })
  name: string;

  @Column('varchar', { length: 255, nullable: true })
  @Exclude()
  refresh_token: string | null;

  @Column('varchar', { length: 255, nullable: true })
  description: string;

  @Column('varchar', { length: 255, nullable: true })
  profile_image: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at?: Date | null;

  @OneToMany(
    () => TagFolderEntity,
    (folder: TagFolderEntity) => folder.user_id,
    {
      cascade: true,
    },
  )
  tag_folders: TagFolderEntity[];

  @OneToMany(() => PostEntity, (post: PostEntity) => post.user_id, {
    cascade: true,
  })
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.user_id, {
    cascade: true,
  })
  comments: CommentEntity[];
}
