# Doclos - Quick Start Guide

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Docker and Docker Compose

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start infrastructure (PostgreSQL + Redis)

```bash
docker-compose -f docker/docker-compose.yml up -d
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Initialize database

```bash
# Create database schema
cd apps/backend
npx typeorm schema:sync -d src/database/data-source.ts
```

### 5. Start development

```bash
# Start backend
cd apps/backend
npm run start:dev
```

The API will be available at `http://localhost:3001/api/v1`

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token

### Documents

- `POST /api/v1/documents/upload` - Upload document
- `GET /api/v1/documents` - List documents
- `GET /api/v1/documents/:id` - Get document details
- `PATCH /api/v1/documents/:id/validate` - Validate extracted data
- `POST /api/v1/documents/:id/reprocess` - Reprocess document

### Jobs

- `GET /api/v1/jobs/:id` - Get job status

## Example Usage

### Register a user

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

### Upload a document

```bash
curl -X POST http://localhost:3001/api/v1/documents/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/document.pdf"
```

## Project Structure

```
doclos/
├── apps/
│   └── backend/           # NestJS API
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/          # Authentication
│       │   │   ├── documents/     # Document management
│       │   │   └── jobs/          # Background jobs
│       │   └── database/          # Database entities
│       └── package.json
├── packages/
│   └── shared/            # Shared types (future)
├── docker/
│   └── docker-compose.yml
└── turbo.json
```

## Development Status

- ✅ Turborepo monorepo structure
- ✅ NestJS backend setup
- ✅ PostgreSQL + Redis via Docker
- ✅ Authentication (JWT)
- ✅ Document upload API
- ✅ Document processing queue (BullMQ)
- ✅ Document validation API
- ✅ Database entities
- 🚧 S3 integration (TODO)
- 🚧 OCR processing (TODO)
- 🚧 LLM extraction (TODO)
- 🚧 Frontend (Next.js) - Not started

## Next Steps

1. Implement S3 storage service
2. Implement OCR processing with Tesseract
3. Implement LLM extraction with Claude/OpenAI
4. Add search functionality
5. Build Next.js frontend
