import { CategoryEntity } from './categories.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TagEntity } from './tags.entity';
import { FileEntity } from './files.entity';
import { UserEntity } from './users.entity';
import { CommentEntity } from './comments.entity';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('text')
  content: string;

  @Column('boolean', { default: false })
  public_status: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at?: Date | null;

  @ManyToOne(() => UserEntity, (user_id: UserEntity) => user_id.posts)
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  ])
  user_id: UserEntity;

  @ManyToOne(
    () => CategoryEntity,
    (category_id: CategoryEntity) => category_id.posts,
  )
  @JoinColumn([
    {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  ])
  category_id: CategoryEntity;

  @OneToMany(() => FileEntity, (file: FileEntity) => file.post_id, {
    cascade: true,
  })
  files: FileEntity[];

  @ManyToMany(() => TagEntity, (tag: TagEntity) => tag.posts, {
    cascade: true,
  })
  @JoinTable({
    name: 'posts_tags',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[];

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.post_id, {
    cascade: true,
  })
  comments: CommentEntity[];
}
