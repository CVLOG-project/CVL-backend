import { PostEntity } from './posts.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TagFolderEntity } from './tagFolders.entity';

@Entity('tags')
export class TagEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 200 })
  name: string;

  @ManyToOne(
    () => TagFolderEntity,
    (folder_id: TagFolderEntity) => folder_id.tags,
  )
  @JoinColumn([
    {
      name: 'folder_id',
      referencedColumnName: 'id',
    },
  ])
  folder_id: TagFolderEntity;

  @ManyToMany(() => PostEntity, (post: PostEntity) => post.tags)
  posts: PostEntity[];
}
