// Part 2: Data Model - Field Extractions table (for tracking AI/OCR results with confidence)
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { Document } from './document.entity';

@Entity('field_extractions')
@Index(['document_id'])
@Index(['field_name'])
export class FieldExtraction extends BaseEntity {
  @Column({ name: 'document_id' })
  document_id: string;

  @ManyToOne(() => Document)
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column({ name: 'field_name' })
  field_name: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'numeric', precision: 3, scale: 2 })
  confidence: number;

  @Column()
  source: string; // 'ocr' or 'llm'

  @Column({ type: 'text', nullable: true })
  snippet: string;
}
