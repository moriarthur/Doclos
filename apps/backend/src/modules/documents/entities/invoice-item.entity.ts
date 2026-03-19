// Part 2: Data Model - Invoice Items table
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { Invoice } from './invoice.entity';

@Entity('invoice_items')
export class InvoiceItem extends BaseEntity {
  @Column({ name: 'invoice_id' })
  invoice_id: string;

  @ManyToOne(() => Invoice)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  unit_price: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  line_total: number;
}
