# Doclos - AI Document Automation SaaS

Monorepo for the Doclos SaaS application.

## Structure

```
doclos/
├── apps/
│   └── backend/          # NestJS API
├── packages/
│   ├── shared/           # Shared types and utilities
│   ├── ui/               # Shared UI components (future)
│   └── workers/          # Background workers (future)
├── docker/
│   └── docker-compose.yml
└── turbo.json
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Stack

- **Backend**: NestJS, TypeScript, PostgreSQL
- **Queue**: Redis, BullMQ
- **Storage**: AWS S3 / Cloudflare R2
- **AI**: Claude, OpenAI
- **OCR**: Tesseract

## Documentation

See `documentations/` folder for detailed architecture docs.

## Development

### Database

```bash
# Start PostgreSQL
docker-compose -f docker/docker-compose.yml up -d

# Run migrations
pnpm db:migrate
```

### Environment

Copy `.env.example` to `.env` and configure:
- Database connection
- JWT secret
- S3 credentials
- AI API keys
