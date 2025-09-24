import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username!: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  nickname?: string | null;

  @Column()
  passwordHash!: string;

  @Column({ type: 'boolean', default: null, nullable: true })
  isApproved?: boolean | null; // null = pending, true = approved, false = rejected;

  @CreateDateColumn()
  createdAt!: Date;
}
