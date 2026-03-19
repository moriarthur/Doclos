# Doclos Coding Conventions

## TypeScript Standards
- **Strict mode** enabled
- All functions properly typed
- Interfaces/Types for all API responses
- No `any` types without justification

## Code Style
- **ESLint + Prettier** for formatting
- Modular, maintainable code structure
- Clear separation of concerns (backend/frontend/workers/shared)
- Inline comments referencing documentation source (e.g., `// Part 4: API Spec`)

## File Organization
```
src/
├── backend/          # NestJS API
├── frontend/         # Next.js app
├── workers/          # Background processing
├── ai_pipeline/      # AI/OCR logic
└── shared/           # Shared types, utilities
```

## API Conventions
- Base path: `/api/v1`
- Authentication: Bearer JWT
- Response format: Consistent JSON structure
- Error format: `{ error: { code, message } }`
- Pagination: `{ data: [], pagination: { page, limit, total } }`

## Database Conventions
- UUID primary keys
- `created_at` / `updated_at` timestamps
- Foreign key relationships properly indexed
- JSONB for flexible metadata (field_extractions)

## Validation
- **Zod** schemas for request validation
- Validation rules in Part 2 documentation
- Confidence scores for AI-extracted fields

## Internationalization
- English (en) and German (de)
- Translation files: `/i18n/locales/{lang}/`
