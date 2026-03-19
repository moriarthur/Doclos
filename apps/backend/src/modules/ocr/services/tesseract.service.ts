import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWorker } from 'tesseract.js';

// Part 3: AI Pipeline - Tesseract OCR service
// Performs OCR on preprocessed images

@Injectable()
export class TesseractService {
  private readonly logger = new Logger(TesseractService.name);
  private readonly languages: string;

  constructor(private configService: ConfigService) {
    // Default: German + English for German market
    this.languages = this.configService.get('TESSERACT_LANGUAGES') || 'deu+eng';
  }

  /**
   * Perform OCR on an image buffer
   * @param imageBuffer - Preprocessed image buffer
   * @returns OCR result with text and confidence
   */
  async performOcr(imageBuffer: Buffer): Promise<{
    text: string;
    confidence: number;
    words: Array<{
      text: string;
      confidence: number;
      bbox: { x0: number; y0: number; x1: number; y1: number };
    }>;
  }> {
    let worker;
    try {
      this.logger.log(`Starting OCR with languages: ${this.languages}`);

      // Create Tesseract worker
      worker = await createWorker(this.languages);

      // Set OCR parameters for better results
      await worker.setParameters({
        // @ts-expect-error - Tesseract.js types may not match actual API
        tessedit_pageseg_mode: '3', // Automatic page segmentation
        preserve_interword_spaces: '1',
      });

      // Perform OCR
      const result = await worker.recognize(imageBuffer);

      // Calculate average confidence
      const confidence = result.data.confidence;
      
      // Extract words with bounding boxes
      const words = result.data.words.map((word) => ({
        text: word.text,
        confidence: word.confidence,
        bbox: {
          x0: word.bbox.x0,
          y0: word.bbox.y0,
          x1: word.bbox.x1,
          y1: word.bbox.y1,
        },
      }));

      this.logger.log(`OCR complete with confidence: ${confidence}%`);

      // Check if confidence is below threshold
      const fallbackThreshold = parseFloat(
        this.configService.get('OCR_FALLBACK_THRESHOLD') || '0.70',
      );
      if (confidence / 100 < fallbackThreshold) {
        this.logger.warn(
          `OCR confidence (${confidence}%) below threshold (${fallbackThreshold * 100}%)`,
        );
      }

      return {
        text: result.data.text,
        confidence: confidence / 100, // Convert to 0-1 range
        words,
      };
    } catch (error) {
      this.logger.error(`OCR failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    } finally {
      if (worker) {
        await worker.terminate();
      }
    }
  }

  /**
   * Perform OCR with detailed line and paragraph information
   * @param imageBuffer - Preprocessed image buffer
   * @returns Detailed OCR result
   */
  async performDetailedOcr(imageBuffer: Buffer): Promise<{
    text: string;
    confidence: number;
    lines: Array<{
      text: string;
      confidence: number;
      bbox: { x0: number; y0: number; x1: number; y1: number };
    }>;
    paragraphs: Array<{
      text: string;
      confidence: number;
      bbox: { x0: number; y0: number; x1: number; y1: number };
    }>;
  }> {
    let worker;
    try {
      this.logger.log('Starting detailed OCR');

      worker = await createWorker(this.languages);

      const result = await worker.recognize(imageBuffer);

      // Extract lines
      const lines = result.data.lines?.map((line) => ({
        text: line.text,
        confidence: line.confidence,
        bbox: line.bbox,
      })) || [];

      // Extract paragraphs
      const paragraphs = result.data.paragraphs?.map((para) => ({
        text: para.text,
        confidence: para.confidence,
        bbox: para.bbox,
      })) || [];

      this.logger.log('Detailed OCR complete');

      return {
        text: result.data.text,
        confidence: result.data.confidence / 100,
        lines,
        paragraphs,
      };
    } catch (error) {
      this.logger.error(`Detailed OCR failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    } finally {
      if (worker) {
        await worker.terminate();
      }
    }
  }

  /**
   * Check if OCR result quality is acceptable
   * @param confidence - OCR confidence score (0-1)
   * @returns True if quality is acceptable
   */
  isQualityAcceptable(confidence: number): boolean {
    const threshold = parseFloat(
      this.configService.get('OCR_FALLBACK_THRESHOLD') || '0.70',
    );
    return confidence >= threshold;
  }
}
