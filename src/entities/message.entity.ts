import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './users.entity';

@Entity('messages')
export class MessageEntity extends BaseEntity {
  /** 실제 Column Info */
  @PrimaryColumn({ comment: 'index', type: 'int4' })
  id: number;

  @Column({ comment: '메시지를 받는 유저의 id', nullable: false, type: 'int4' })
  receiver_id: number;

  @Column({ comment: '메시지를 보낸 유저의 id', nullable: false, type: 'int4' })
  sender_id: number;

  @Column({
    comment: '메시지 내용',
    nullable: false,
    type: 'varchar',
    length: 300,
  })
  contents: string;

  @Column({
    comment: '받는 유저의 메시지 삭제여부',
    default: false,
  })
  receiver_delete_yn: boolean;

  @Column({
    comment: '보낸 유저의 메시지 삭제여부',
    default: false,
  })
  sender_delete_yn: boolean;

  @Column({ comment: '메시지 열람 여부', type: 'timestamptz' })
  opened_at: Date;

  @CreateDateColumn({
    comment: '생성 일자',
    type: 'timestamptz',
    nullable: false,
  })
  created_at: Date;

  @DeleteDateColumn({ comment: '받는 유저의 삭제 일자', type: 'timestamptz' })
  receiver_delete_at: Date;

  @DeleteDateColumn({ comment: '보낸 유저의 삭제 일자', type: 'timestamptz' })
  sender_delete_at: Date;

  /** 관계 설정 */
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.receiveMessages)
  @JoinColumn([
    {
      name: 'receiver_id',
      referencedColumnName: 'id',
    },
  ])
  receiver: UserEntity;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.sendMessages)
  @JoinColumn([
    {
      name: 'sender_id',
      referencedColumnName: 'id',
    },
  ])
  sender: UserEntity;
}
