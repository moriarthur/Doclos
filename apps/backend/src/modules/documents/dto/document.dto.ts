import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { DocumentStatus, DocumentType } from '../entities/document.entity';

// Part 4: API Specification - Document response DTO

export class DocumentResponseDto {
  id: string;
  type: DocumentType;
  status: DocumentStatus;
  company_name?: string;
  amount?: number;
  currency?: string;
  invoice_date?: string;
  created_at: Date;
}

// Part 4: API Specification - List documents query DTO
export class ListDocumentsQueryDto {
  @IsOptional()
  @IsString()
  page?: string = '1';

  @IsOptional()
  @IsString()
  limit?: string = '20';

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsDateString()
  from_date?: string;

  @IsOptional()
  @IsDateString()
  to_date?: string;
}

// Part 4: API Specification - Pagination response DTO
export class PaginationDto {
  page: number;
  limit: number;
  total: number;
}

// Part 4: API Specification - Document list response DTO
export class DocumentListResponseDto {
  data: DocumentResponseDto[];
  pagination: PaginationDto;
}
