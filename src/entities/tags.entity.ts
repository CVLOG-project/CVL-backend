import { PostEntity } from './posts.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tags')
export class TagEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 200 })
  name: string;

  @ManyToMany(() => PostEntity, (post: PostEntity) => post.tags)
  posts: PostEntity[];
}
