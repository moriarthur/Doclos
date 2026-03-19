# PART 4 — API SPECIFICATION

This document defines the REST API used by the Doclos system.

Goals:

• predictable endpoints
• strict request/response schemas
• compatibility with frontend and workers
• easy OpenAPI generation

Base API path:

/api/v1

Content type:

application/json

Authentication:

Bearer JWT tokens

---

# AUTHENTICATION

The system supports two authentication methods.

1. Email + password
2. OAuth (Google, Microsoft)

After authentication the client receives a JWT access token.

Authorization header format:

Authorization: Bearer <token>

Access token lifetime:

15 minutes

Refresh token lifetime:

30 days

---

# AUTH ENDPOINTS

## Register

POST /api/v1/auth/register

Request:

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:

{
  "user_id": "uuid",
  "access_token": "jwt",
  "refresh_token": "jwt"
}

---

## Login

POST /api/v1/auth/login

Request:

{
  "email": "user@example.com",
  "password": "password123"
}

Response:

{
  "access_token": "jwt",
  "refresh_token": "jwt"
}

---

## Refresh Token

POST /api/v1/auth/refresh

Request:

{
  "refresh_token": "token"
}

Response:

{
  "access_token": "jwt"
}

---

# DOCUMENT UPLOAD API

## Upload Document

POST /api/v1/documents/upload

Content-Type:

multipart/form-data

Fields:

file
metadata (optional JSON)

Example metadata:

{
 "type": "invoice"
}

Response:

{
 "document_id": "uuid",
 "status": "uploaded"
}

Server actions:

• store file in S3
• create DB record
• enqueue processing job

---

# DOCUMENT LIST API

## List Documents

GET /api/v1/documents

Query parameters:

page
limit
status
company
from_date
to_date

Example:

/api/v1/documents?page=1&limit=20

Response:

{
 "data": [
  {
   "id": "uuid",
   "type": "invoice",
   "status": "processed",
   "company_name": "Bau GmbH",
   "amount": 3200,
   "currency": "EUR",
   "invoice_date": "2026-03-10"
  }
 ],
 "pagination": {
  "page": 1,
  "limit": 20,
  "total": 150
 }
}

---

# DOCUMENT DETAILS API

## Get Document

GET /api/v1/documents/{id}

Response:

{
 "id": "uuid",
 "status": "processed",
 "file_url": "https://storage...",
 "invoice": {
  "invoice_number": {
   "value": "RE-2026-004",
   "confidence": 0.94
  },
  "amount_total": {
   "value": 3200,
   "currency": "EUR",
   "confidence": 0.96
  }
 }
}

---

# DOCUMENT VALIDATION API

Allows users to correct AI extracted values.

PATCH /api/v1/documents/{id}/validate

Request:

{
 "fields": {
  "invoice_number": "RE-2026-004",
  "amount_total": 3200
 }
}

Response:

{
 "status": "validated"
}

Server actions:

• update invoice fields
• write audit log
• mark document validated

---

# DOCUMENT REPROCESSING API

Re-run AI pipeline for document.

POST /api/v1/documents/{id}/reprocess

Response:

{
 "status": "processing"
}

Server action:

queue job: reprocess_document

---

# SEARCH API

Search documents by fields.

GET /api/v1/search

Query parameters:

query
company
invoice_number
amount

Example:

/api/v1/search?query=Bau

Response:

{
 "results": [
  {
   "document_id": "uuid",
   "invoice_number": "RE-2026-004",
   "company": "Bau GmbH",
   "amount": 3200
  }
 ]
}

---

# EXPORT API

Allows exporting invoice data.

Supported formats:

Excel
CSV
JSON

---

## Export Excel

GET /api/v1/export/excel

Query parameters:

from_date
to_date
company

Response:

{
 "download_url": "https://storage/export/file.xlsx"
}

Implementation:

Worker generates Excel file using streaming writer.

File stored in S3.

Signed URL returned to client.

---

# JOB STATUS API

Allows frontend to monitor processing jobs.

GET /api/v1/jobs/{id}

Response:

{
 "status": "processing",
 "progress": 45
}

---

# DOCUMENT STATUS MODEL

Possible document states:

uploaded
processing
parsed
needs_validation
validated
archived
error

---

# ERROR RESPONSE FORMAT

All errors follow a consistent structure.

{
 "error": {
  "code": "DOCUMENT_NOT_FOUND",
  "message": "Document does not exist"
 }
}

Common error codes:

UNAUTHORIZED
INVALID_REQUEST
DOCUMENT_NOT_FOUND
UPLOAD_FAILED
PROCESSING_ERROR

---

# PAGINATION STANDARD

All list endpoints use pagination.

Query parameters:

page
limit

Response:

{
 "data": [],
 "pagination": {
  "page": 1,
  "limit": 20,
  "total": 250
 }
}

---

# RATE LIMITING

To prevent abuse:

Upload endpoints:

20 requests per minute

Search endpoints:

60 requests per minute

Implementation:

Redis rate limiter

---

# OPENAPI / SWAGGER

The backend should auto‑generate API documentation.

Tool:

NestJS Swagger

Endpoint:

/api/docs

Provides interactive documentation for developers.

---

END OF PART 4

Next file:

PART 5 — FRONTEND ARCHITECTURE
