# Doclos Task Completion Checklist

When completing a development task in Doclos, verify:

## Code Quality
- [ ] TypeScript strict mode compliance (no `any` without justification)
- [ ] ESLint passes without errors
- [ ] Prettier formatting applied
- [ ] Inline comments reference documentation source (e.g., `// Part 4: API Spec`)

## Testing
- [ ] Unit tests written for new functions
- [ ] Integration tests for API endpoints
- [ ] Tests pass successfully
- [ ] Coverage threshold met (if configured)

## Documentation
- [ ] CLAUDE.md updated if architecture changed
- [ ] API documentation updated (Swagger/OpenAPI)
- [ ] Database migrations documented

## Security
- [ ] Input validation with Zod schemas
- [ ] Authentication/authorization checks in place
- [ ] No sensitive data in error messages
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output sanitization)

## GDPR & Compliance
- [ ] Audit log entries for data changes
- [ ] Proper data retention handling
- [ ] User data access/erasure endpoints updated

## Performance
- [ ] Database queries properly indexed
- [ ] No N+1 query problems
- [ ] Background jobs for heavy tasks (OCR, LLM, export)
- [ ] Streaming for large file operations

## API Consistency
- [ ] Follows `/api/v1` base path convention
- [ ] Proper error response format: `{ error: { code, message } }`
- [ ] Pagination for list endpoints
- [ ] JWT authentication on protected routes

## Frontend
- [ ] Responsive design (mobile-friendly)
- [ ] Loading states for async operations
- [ ] Error handling with user-friendly messages
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] i18n translations for new UI text
