import { Entity, Unique, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  // @Column({ nullable: true })
  // avatarUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity('group_members')
@Unique(['groupId', 'userId'])
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  groupId!: string;

  @Column()
  userId!: string;

  @Column({ default: 'member' })
  role!: 'owner' | 'moderator' | 'member'; 
  // owner = chủ phòng
  // member = thành viên thường

  @CreateDateColumn()
  joinedAt!: Date;
}

