# PART 5 — FRONTEND ARCHITECTURE

This document defines the frontend architecture for the Doclos web application.

The frontend is responsible for:

• document upload
• document browsing
• validation of AI extracted fields
• search and filtering
• exporting reports
• displaying document processing status

The frontend must be responsive, fast, and simple to use for non‑technical business users.

---

# TECHNOLOGY STACK

Framework:

Next.js

Language:

TypeScript

UI library:

React

Styling:

TailwindCSS

Component primitives:

shadcn/ui

State management:

React Query (TanStack Query)

Forms:

React Hook Form

Validation:

Zod

PDF Viewer:

PDF.js

Internationalization:

next-i18next

---

# APPLICATION STRUCTURE

Recommended project structure:

src/

app/

components/

features/

lib/

services/

hooks/

types/

i18n/

---

# NEXT.JS ROUTING STRUCTURE

Main routes:

/

Dashboard page

/upload

Document upload interface

/documents/[id]

Document details and validation page

/search

Advanced search page

/settings

User settings

---

# DASHBOARD PAGE

Route:

/

Purpose:

Show list of processed documents.

UI components:

DocumentTable
SearchBar
FilterPanel
UploadButton
ExportButton

Table columns:

Invoice Number
Company
Date
Amount
Currency
Status

Each row links to document detail page.

---

# DOCUMENT UPLOAD PAGE

Route:

/upload

Purpose:

Allow users to upload documents.

Features:

Drag and drop upload
Multiple file upload
Upload progress indicator

Components:

DropzoneUploader
UploadQueue
FilePreview

Accepted file types:

PDF
PNG
JPG
TIFF

Client sends file using multipart request.

---

# DOCUMENT DETAILS PAGE

Route:

/documents/[id]

Purpose:

Display original document and extracted data.

Layout:

Two-column layout.

Left side:

PDF Viewer

Right side:

Extracted fields
Validation controls
Document timeline

---

# PDF VIEWER

Library:

PDF.js

Features:

Zoom
Page navigation
Text selection
Highlight extracted fields

Optional enhancement:

Highlight OCR snippets used by AI extraction.

---

# FIELD VALIDATION UI

Each extracted field displays:

Value
Confidence score
Edit button

Example UI element:

Invoice Number

RE-2026-004

Confidence: 0.94

If confidence is low the field is highlighted.

User can edit value and confirm.

Save action calls validation API.

---

# DOCUMENT TIMELINE

Displays processing stages.

Example timeline:

Uploaded
Processing
OCR completed
AI extraction
Needs validation
Validated

Timeline helps users understand document state.

---

# SEARCH PAGE

Route:

/search

Features:

Search by:

Invoice number
Company name
Amount
Date range

UI components:

SearchInput
FiltersPanel
ResultsTable

Results link to document details.

---

# EXPORT UI

Users can export invoice data.

Export options:

Excel
CSV
JSON

UI component:

ExportModal

User selects:

Date range
Company
File format

Frontend calls export API.

Download link returned by server.

---

# STATE MANAGEMENT

Server state handled using React Query.

Benefits:

Caching
Background refresh
Error handling
Automatic retries

Example usage:

useQuery('documents', fetchDocuments)

Mutations:

uploadDocument
validateDocument
reprocessDocument

---

# API CLIENT LAYER

API calls centralized in service layer.

Directory:

/services/api/

Example files:

apiClient.ts

documentsApi.ts

authApi.ts

exportApi.ts

Example request:

GET /api/v1/documents

Client wrapper handles:

Auth headers
Error parsing
Response typing

---

# TYPE DEFINITIONS

All API responses must have TypeScript types.

Directory:

/types

Example:

Document
Invoice
InvoiceItem
User

Types generated from OpenAPI when possible.

---

# INTERNATIONALIZATION

Languages supported:

English
German

Translation files stored in:

/i18n/locales

Structure:

en/

common.json

pages.json

components.json

German equivalents in:

de/

---

# ERROR HANDLING

Frontend must handle:

Network errors
Unauthorized access
Processing failures

UI responses:

Toast notifications
Inline error messages
Retry buttons

---

# PERFORMANCE CONSIDERATIONS

Large PDF files should not block UI.

Strategies:

Lazy load PDF viewer
Paginated tables
React Query caching
Virtualized tables (react-virtual)

---

# ACCESSIBILITY

UI should follow accessibility standards.

Requirements:

Keyboard navigation
Proper ARIA labels
High contrast UI

---

# FUTURE FRONTEND FEATURES

Mobile interface
Bulk document upload
Document tagging
Saved searches
Dashboard analytics

---

END OF PART 5

Next document:

PART 6 — EXCEL EXPORT SYSTEM

