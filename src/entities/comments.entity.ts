import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './users.entity';
import { PostEntity } from './posts.entity';

@Entity('comments')
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at?: Date | null;

  @ManyToOne(() => UserEntity, (user_id: UserEntity) => user_id.comments)
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  ])
  user_id: UserEntity;

  @ManyToOne(() => PostEntity, (post_id: PostEntity) => post_id.comments)
  @JoinColumn([
    {
      name: 'post_id',
      referencedColumnName: 'id',
    },
  ])
  post_id: PostEntity;
}
