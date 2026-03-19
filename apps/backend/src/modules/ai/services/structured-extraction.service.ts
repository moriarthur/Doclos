import { Injectable, Logger } from '@nestjs/common';
import { AiService } from './ai.service';
import {
  INVOICE_EXTRACTION_SYSTEM,
  INVOICE_EXTRACTION_PROMPT,
  CONFIDENCE_ASSESSMENT_PROMPT,
} from '../prompts/extraction.prompts';

// Part 3: AI Pipeline - Structured data extraction service
// Extracts invoice data using Claude LLM

export interface InvoiceExtraction {
  invoice_number: string | null;
  invoice_date: string | null;
  due_date: string | null;
  amount_total: number | null;
  vat_amount: number | null;
  currency: string | null;
  supplier_name: string | null;
  supplier_address: string | null;
  vat_rate?: number | null;
  customer_name?: string | null;
  items?: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>;
}

export interface ExtractionWithConfidence {
  data: InvoiceExtraction;
  confidence: {
    overall: number;
    fields: Record<string, number>;
  };
  cost: number;
}

@Injectable()
export class StructuredExtractionService {
  private readonly logger = new Logger(StructuredExtractionService.name);

  constructor(private aiService: AiService) {}

  /**
   * Extract structured invoice data from document text
   * @param text - OCR-extracted text from the document
   * @returns Extraction result with confidence scores
   */
  async extractInvoiceData(text: string): Promise<ExtractionWithConfidence> {
    if (!this.aiService.isAvailable()) {
      throw new Error('AI service not available - cannot perform extraction');
    }

    try {
      this.logger.log('Extracting invoice data with LLM');

      // Step 1: Extract structured data
      const extractionPrompt = INVOICE_EXTRACTION_PROMPT(text);
      const { data: extraction, usage } = await this.aiService.sendJsonMessage<InvoiceExtraction>(
        extractionPrompt,
        INVOICE_EXTRACTION_SYSTEM,
      );

      // Step 2: Assess confidence for each field
      const confidence = await this.assessConfidence(extraction, text);

      const cost = this.aiService.estimateCost(usage.inputTokens, usage.outputTokens);

      this.logger.log(
        `Invoice extraction complete - Overall confidence: ${confidence.overall.toFixed(2)} (cost: $${cost.toFixed(4)})`,
      );

      return { data: extraction, confidence, cost };
    } catch (error) {
      this.logger.error(`Invoice extraction failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Assess confidence scores for extracted fields
   * @param extraction - Extracted data
   * @param text - Original text for verification
   * @returns Confidence scores
   */
  private async assessConfidence(
    extraction: InvoiceExtraction,
    text: string,
  ): Promise<{ overall: number; fields: Record<string, number> }> {
    try {
      const prompt = CONFIDENCE_ASSESSMENT_PROMPT(extraction, text);
      const { data } = await this.aiService.sendJsonMessage<{
        overall_confidence: number;
        field_confidence: Record<string, number>;
        issues: string[];
      }>(prompt);

      return {
        overall: data.overall_confidence,
        fields: data.field_confidence,
      };
    } catch (error) {
      this.logger.warn(`Confidence assessment failed: ${error instanceof Error ? error.message : String(error)}`);
      // Return default confidence scores
      return {
        overall: 0.7,
        fields: {
          invoice_number: 0.7,
          amount_total: 0.7,
          invoice_date: 0.7,
        },
      };
    }
  }

  /**
   * Normalize extracted data
   * Applies validation and formatting rules
   * @param extraction - Raw extraction result
   * @returns Normalized extraction
   */
  normalizeExtraction(extraction: InvoiceExtraction): InvoiceExtraction {
    const normalized = { ...extraction };

    // Normalize dates to ISO format
    if (normalized.invoice_date && typeof normalized.invoice_date === 'string') {
      normalized.invoice_date = this.normalizeDate(normalized.invoice_date);
    }
    if (normalized.due_date && typeof normalized.due_date === 'string') {
      normalized.due_date = this.normalizeDate(normalized.due_date);
    }

    // Ensure amounts are numbers
    if (normalized.amount_total && typeof normalized.amount_total === 'string') {
      const amountStr = normalized.amount_total as string;
      normalized.amount_total = parseFloat(amountStr.replace(/[^\d.-]/g, ''));
    }
    if (normalized.vat_amount && typeof normalized.vat_amount === 'string') {
      const vatStr = normalized.vat_amount as string;
      normalized.vat_amount = parseFloat(vatStr.replace(/[^\d.-]/g, ''));
    }

    // Validate currency code
    if (normalized.currency) {
      normalized.currency = normalized.currency.toUpperCase().substring(0, 3);
    }

    return normalized;
  }

  /**
   * Normalize date to ISO format
   * Handles German date format (DD.MM.YYYY)
   * @param dateStr - Date string
   * @returns ISO date string or null
   */
  private normalizeDate(dateStr: string): string | null {
    try {
      // Try parsing as ISO
      const isoDate = new Date(dateStr);
      if (!isNaN(isoDate.getTime())) {
        return isoDate.toISOString().split('T')[0];
      }

      // Try German format (DD.MM.YYYY)
      const germanMatch = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
      if (germanMatch) {
        const [, day, month, year] = germanMatch;
        return `${year}-${month}-${day}`;
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Validate extraction results
   * Checks for required fields and logical consistency
   * @param extraction - Extraction to validate
   * @returns Validation result with any issues found
   */
  validateExtraction(extraction: InvoiceExtraction): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check required fields
    if (!extraction.invoice_number) {
      issues.push('Invoice number is missing');
    }
    if (!extraction.amount_total) {
      issues.push('Total amount is missing');
    }
    if (!extraction.invoice_date) {
      issues.push('Invoice date is missing');
    }

    // Validate amounts
    if (extraction.amount_total && extraction.amount_total < 0) {
      issues.push('Total amount is negative');
    }
    if (extraction.vat_amount && extraction.vat_amount < 0) {
      issues.push('VAT amount is negative');
    }

    // Check dates
    if (extraction.due_date && extraction.invoice_date) {
      const dueDate = new Date(extraction.due_date);
      const invoiceDate = new Date(extraction.invoice_date);
      if (dueDate < invoiceDate) {
        issues.push('Due date is before invoice date');
      }
    }

    // Check item totals
    if (extraction.items && extraction.items.length > 0) {
      const itemsTotal = extraction.items.reduce((sum, item) => sum + (item.line_total || 0), 0);
      if (Math.abs(itemsTotal - (extraction.amount_total || 0)) > (extraction.amount_total || 0) * 0.005) {
        issues.push(`Sum of line items (${itemsTotal}) differs from total (${extraction.amount_total})`);
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}
