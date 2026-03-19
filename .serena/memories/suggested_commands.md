# Doclos Suggested Commands

## Development Commands (To be configured)

### Backend
```bash
# Start NestJS backend
cd src/backend && npm run start:dev

# Run backend tests
cd src/backend && npm run test

# Backend linting
cd src/backend && npm run lint
```

### Frontend
```bash
# Start Next.js frontend
cd src/frontend && npm run dev

# Frontend build
cd src/frontend && npm run build

# Frontend linting
cd src/frontend && npm run lint
```

### Workers
```bash
# Start OCR worker
cd src/workers && npm run worker:ocr

# Start LLM worker
cd src/workers && npm run worker:llm

# Start export worker
cd src/workers && npm run worker:export
```

### Database
```bash
# Run migrations
npm run db:migrate

# Seed database (for development)
npm run db:seed

# Open database shell
psql $DATABASE_URL
```

## System Commands (Darwin/macOS)

### Git
```bash
git status                    # Check git status
git add .                     # Stage all changes
git commit -m "message"       # Commit changes
git push                      # Push to remote
```

### File Operations
```bash
ls -la                       # List all files
find . -name "*.ts"          # Find TypeScript files
grep -r "pattern" src/       # Search in files
```

### Docker
```bash
docker-compose up -d         # Start all services
docker-compose down          # Stop all services
docker-compose logs -f       # Follow logs
```

## Testing Commands
```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## Code Quality
```bash
# Lint all
npm run lint

# Format all
npm run format

# Type check
npm run type-check
```

## Note
These commands will be configured when the project scaffold is created. Currently in documentation phase.
