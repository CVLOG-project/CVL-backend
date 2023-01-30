import { PostEntity } from './posts.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('files')
export class FileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 512 })
  key: string;

  @ManyToOne(() => PostEntity, (post_id: PostEntity) => post_id.files)
  @JoinColumn([
    {
      name: 'post_id',
      referencedColumnName: 'id',
    },
  ])
  post_id: PostEntity;
}
