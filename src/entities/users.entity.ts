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

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  github_id: string;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 60, nullable: true })
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
}
