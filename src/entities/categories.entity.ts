import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './posts.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 30 })
  name: string;

  @OneToMany(() => PostEntity, (post: PostEntity) => post.category_id, {
    cascade: true,
  })
  posts: PostEntity[];
}
