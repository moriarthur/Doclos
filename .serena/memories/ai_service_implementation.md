# Doclos AI Service Implementation

## AI Provider: GLM (Zhipu AI / Z.ai)

**NOT Anthropic Claude** - Project uses GLM API from Z.ai.

## API Details

- **Base URL:** https://open.bigmodel.cn/api/paas/v4
- **Authentication:** Bearer token (API key from https://open.bigmodel.cn/usercenter/apikeys)
- **Endpoint:** /chat/completions (OpenAI-compatible)

## Models Available

| Model | Use Case | Price |
|-------|----------|-------|
| glm-4-flash | Document processing (default) | ¥0.1/M tokens |
| glm-4-air | Balanced tasks | ¥0.5/M tokens |
| glm-4-plus | Complex extraction | ¥1.0/M tokens |
| glm-4 | Standard tasks | ¥1.0/M tokens |

## Implementation

File: `apps/backend/src/modules/ai/services/ai.service.ts`

Key methods:
- `sendMessage(prompt, systemPrompt?)` - Send text message to GLM
- `sendJsonMessage<T>(prompt, systemPrompt?)` - Send message expecting JSON response
- `isAvailable()` - Check if API key is configured
- `estimateCost(inputTokens, outputTokens)` - Estimate cost in CNY

## Usage in Code

```typescript
// Document classification
const classification = await documentClassifierService.classifyDocument(text);
// Returns: { type: DocumentType, confidence: number, reasoning: string }

// Invoice extraction
const extraction = await structuredExtractionService.extractInvoiceData(text);
// Returns: { data: InvoiceExtraction, confidence: {...}, cost: number }
```

## Prompts Location

- Classification prompts: `apps/backend/src/modules/ai/prompts/classification.prompts.ts`
- Extraction prompts: `apps/backend/src/modules/ai/prompts/extraction.prompts.ts`

## Error Handling

All API calls are wrapped in try-catch with proper error logging.
Fallback to rule-based classification if GLM is unavailable.
