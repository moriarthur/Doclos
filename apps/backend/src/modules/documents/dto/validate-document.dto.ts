import { IsObject, IsString, IsNumber } from 'class-validator';

// Part 4: API Specification - Validate document DTO
// Part 7: Security & GDPR - Audit log on validation

export class ValidateDocumentDto {
  @IsObject()
  fields: Record<string, unknown>;
}

// Part 4: API Specification - Field with confidence
export class FieldWithConfidence {
  @IsString()
  value: string;

  @IsNumber()
  confidence: number;
}

// Part 4: API Specification - Document detail response
export class DocumentDetailDto {
  id: string;
  status: string;
  file_url: string;
  invoice?: {
    invoice_number?: FieldWithConfidence;
    amount_total?: FieldWithConfidence;
    currency?: string;
    invoice_date?: string;
    due_date?: string;
    supplier_name?: FieldWithConfidence;
    supplier_address?: FieldWithConfidence;
  };
}
