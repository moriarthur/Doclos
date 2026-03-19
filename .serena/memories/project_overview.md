# Doclos Project Overview

## Purpose
AI Document Automation SaaS for small businesses and German Mittelstand. Automatically processes business documents (invoices, contracts, offers, delivery notes) using OCR and AI to extract structured data.

## Tech Stack
- **Frontend**: Next.js, React, TypeScript, TailwindCSS, shadcn/ui, React Query, React Hook Form, Zod, PDF.js
- **Backend**: NestJS (or Fastify + TypeScript)
- **Database**: PostgreSQL (JSONB, full-text search)
- **Queue**: Redis + BullMQ
- **Storage**: AWS S3 or Cloudflare R2
- **OCR**: Tesseract (German/English), fallback to Google Vision/AWS Textract
- **AI**: Claude (primary), GPT (fallback)
- **Workers**: Node.js background workers

## Project Status
Early Development - documentation phase, no code implementation yet.

## Documentation Structure
- `documentations/ai_document_automation_claude_code_documentation part 1.md` - Product vision, system architecture
- `documentations/part_3_ai_pipeline.md` - OCR, LLM extraction, confidence scoring
- `documentations/part_4_api_specification.md` - REST API endpoints, schemas
- `documentations/part_5_frontend_architecture.md` - Next.js structure, components
- `documentations/part_6_excel_export_system.md` - Excel/CSV/JSON export
- `documentations/part_7_security_gdpr.md` - Security, GDPR compliance
- `documentations/part_8_infrastructure_deployment.md` - Docker, CI/CD, scaling
- `documentations/part_9_claude_code_development_system.md` - Development workflow

## Core Features
- Document upload (PDF, PNG, JPG, TIFF)
- OCR recognition with German/English support
- AI structured extraction
- Document dashboard with PDF viewer
- Manual validation UI with confidence indicators
- Search (invoice number, company, amount, date)
- Excel export (streaming, large dataset support)
