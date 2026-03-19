// Part 2: Data Model - Audit Logs table for GDPR compliance
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @Column()
  entity_type: string;

  @Column({ name: 'entity_id' })
  entity_id: string;

  @Column({ name: 'user_id', nullable: true })
  user_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  action: string;

  @Column({ type: 'jsonb', nullable: true })
  old_value: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  new_value: Record<string, unknown>;
}
