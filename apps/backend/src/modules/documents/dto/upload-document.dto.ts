import { IsOptional, IsEnum } from 'class-validator';
import { DocumentType } from '../entities/document.entity';

// Part 4: API Specification - Upload metadata DTO

export class UploadDocumentDto {
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;
}
