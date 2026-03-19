// Part 2: Data Model - Users table
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  password_hash: string;

  @Column({ nullable: true })
  oauth_provider: string;

  @Column({ nullable: true })
  oauth_id: string;

  @Column({ type: 'timestamptz', nullable: true })
  last_login: Date;
}
