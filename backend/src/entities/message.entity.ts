import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '@entities/user.entity';
import { Group } from '@entities/group.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  sender!: User;

  @ManyToOne(() => Group, (group) => group.id, { nullable: true })
  group?: Group | null; // null nếu là tin nhắn riêng

  @ManyToOne(() => User, { nullable: true })
  receiver?: User | null; // null nếu là group chat

  @Column({ type: 'text', nullable: true })
  content?: string; // nội dung text

  // @Column({ nullable: true })
  // attachmentUrl?: string; // file (ảnh, video, pdf...)

  @Column({ default: false })
  isEdited!: boolean; // có chỉnh sửa không

  @Column({ default: false })
  isDeleted!: boolean; // có bị xóa không (ẩn message)

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
