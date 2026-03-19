# Doclos TypeScript Errors (To Fix)

## Error Categories

### 1. Unknown Error Type (TS18046)

Many catch blocks have `error` typed as `unknown`. Need to add type guards or use type assertions.

**Locations:**
- `modules/storage/services/s3.service.ts` - Multiple catch blocks
- `modules/ai/services/ai.service.ts` - Error handling in API calls
- `modules/documents/processors/document.processor.ts` - Error handling
- All services with try-catch blocks

**Fix pattern:**
```typescript
// Before
catch (error) {
  this.logger.error(`Failed: ${error.message}`);
}

// After
catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  this.logger.error(`Failed: ${message}`);
}
```

### 2. Decorator Metadata Issues

Decorators on entity properties showing metadata type errors.

**Locations:**
- `database/base.entity.ts` - @PrimaryGeneratedColumn, @CreateDateColumn, @UpdateDateColumn

**Current fix applied:** Added definite assignment assertions (`property!`)

### 3. Entity Property Resolution

Some relations not being recognized properly (id property, relations).

**May be related to:**
- TypeORM decorator metadata
- tsconfig.json settings
- Need to verify at runtime

### 4. Document Module Property Access

**Errors in `documents.service.ts`:**
- `document.id` not recognized on Document type
- `document.invoice` not recognized (relation)

**Investigation needed:** Relation decorators in entities

## Build Status

As of 2026-03-17:
- Dependencies installed successfully
- Build fails with ~378 TypeScript errors
- Most are error type handling (easy to fix)
- Some are decorator metadata (may be false positives)

## Next Steps

1. Fix all error type handling issues
2. Run `pnpm run build` to verify
3. Test runtime with cloud services
