import { UserEntity } from 'src/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  user_id: number;

  @Column()
  category_id: number;

  @Column({ default: false })
  public_status: boolean;

  @ManyToOne(type => UserEntity, user => user.posts)
  user: UserEntity
}
