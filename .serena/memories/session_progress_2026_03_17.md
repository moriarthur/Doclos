# Doclos Project Session Progress (2026-03-17)

## Session Summary

This session focused on building the complete backend infrastructure for Doclos using Turborepo monorepo structure.

## What Was Built

### Monorepo Structure
- Turborepo configuration with workspace setup
- Root package.json with shared scripts
- pnpm-workspace.yaml configuration

### Backend (apps/backend/) - COMPLETE
All modules implemented with Core + Validation features:

1. **Authentication Module** (`modules/auth/`)
   - JWT authentication with register/login/refresh endpoints
   - Password hashing with bcrypt
   - JWT strategy with passport
   - User entity with OAuth support fields

2. **Documents Module** (`modules/documents/`)
   - Document upload with multipart/form-data
   - Document list with pagination and filters
   - Document details with signed S3 URLs
   - Document validation endpoint with audit logging
   - Document reprocessing endpoint
   - Background processor for document processing

3. **Jobs Module** (`modules/jobs/`)
   - Job status tracking
   - Audit log entity for GDPR compliance

4. **Storage Module** (`modules/storage/`)
   - S3 service supporting both AWS S3 and Cloudflare R2
   - Upload, download, signed URLs, delete operations
   - Server-side encryption (AES-256)

5. **OCR Module** (`modules/ocr/`)
   - PDF service for text extraction and metadata
   - Image preprocessing service (grayscale, threshold, noise removal)
   - Tesseract service for OCR (German + English)
   - Main OCR service orchestrating the entire pipeline

6. **AI Module** (`modules/ai/`)
   - AI service using GLM (Zhipu AI / Z.ai) API
   - Document classifier service (invoice, contract, offer, delivery_note)
   - Structured extraction service for invoices
   - Confidence scoring and validation

### Database Entities
- Base entity with UUID primary key and timestamps
- User entity (email, name, password_hash, oauth fields)
- Customer entity (company data from documents)
- Document entity (file metadata, status, type)
- Invoice entity (structured invoice data)
- InvoiceItem entity (line items)
- FieldExtraction entity (OCR/LLM results with confidence)
- Job entity (background job tracking)
- AuditLog entity (GDPR compliance)

### Configuration Files
- `.env` - Created with placeholders for user credentials
- `.env.example` - Full documentation of all environment variables
- `docker/docker-compose.yml` - PostgreSQL + Redis + Adminer
- `turbo.json` - Turborepo configuration
- `pnpm-workspace.yaml` - pnpm workspace configuration

### Documentation
- `CLOUD_SETUP.md` - Complete guide for cloud services setup
- `QUICK_START.md` - Quick start guide for development

## AI Provider Change

**IMPORTANT:** This project uses **GLM (Zhipu AI / Z.ai)**, NOT Anthropic Claude.

GLM API: https://open.bigmodel.cn/api/paas/v4

Models:
- glm-4-flash (default, fastest, ¥0.1/M tokens)
- glm-4-air (balanced)
- glm-4-plus (more capable)
- glm-4 (standard)

## Current Status

**Backend:** Complete (Core + Validation features)
**Frontend:** Not started (Next.js TODO)
**Dependencies:** Installed (pnpm install completed)
**TypeScript:** Has errors (error type handling, decorator metadata) - needs fixing before build

## Environment Variables Required

The `.env` file has been created with placeholders. User needs to add:
- Database connection (Supabase/Neon recommended)
- Redis connection (Upstash recommended)
- Storage credentials (Cloudflare R2/AWS S3)
- GLM API key from https://open.bigmodel.cn/usercenter/apikeys
- JWT secret (generate with: openssl rand -base64 32)

## Next Session Tasks

1. Fix TypeScript errors (error handling types, decorator metadata)
2. Build and test the backend
3. Create Next.js frontend application
4. Implement Search API
5. Implement Excel export worker

## Technical Decisions Made

1. **Monorepo with Turborepo** - For better code sharing and tooling
2. **NestJS** - Chosen for backend framework
3. **GLM (Z.ai)** - Chosen over Claude for cost-effectiveness (¥0.1/M tokens)
4. **TypeORM** - For database ORM
5. **BullMQ + Redis** - For background job processing
6. **Tesseract.js** - For OCR (local, no cost)
7. **Cloudflare R2** - Recommended for storage (S3-compatible, free tier)
8. **Supabase** - Recommended for database (free tier, managed PostgreSQL)
9. **Upstash** - Recommended for Redis (free tier, easy setup)
