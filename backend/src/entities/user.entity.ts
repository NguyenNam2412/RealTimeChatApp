import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username!: string;

  @Column({ unique: true, nullable: true })
  nickname?: string | null;

  @Column()
  passwordHash!: string;

@Column({ default: null, nullable: true })
  isApproved?: boolean | null; // null = pending, true = approved, false = rejected;

  @CreateDateColumn()
  createdAt!: Date;
}
