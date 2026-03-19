import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './services/ai.service';
import { DocumentClassifierService } from './services/document-classifier.service';
import { StructuredExtractionService } from './services/structured-extraction.service';

// Part 3: AI Pipeline - LLM integration module
// Handles document classification and structured data extraction

@Module({
  imports: [ConfigModule],
  providers: [
    AiService,
    DocumentClassifierService,
    StructuredExtractionService,
  ],
  exports: [
    AiService,
    DocumentClassifierService,
    StructuredExtractionService,
  ],
})
export class AiModule {}
