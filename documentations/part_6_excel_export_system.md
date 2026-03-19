# PART 6 — EXCEL EXPORT SYSTEM

This document describes the Excel export functionality for Doclos.

Goals:

• generate Excel reports for invoices
• support multiple formats (Excel, CSV, JSON)
• export by date range, company, or filters
• scalable for large datasets
• maintain formatting and currency precision

---

# EXPORT TYPES

1. Excel (.xlsx)
2. CSV (.csv)
3. JSON (.json)

Frontend allows user to select format.

---

# EXCEL EXPORT LIBRARY

Node.js library:

exceljs

Features:

• streaming writes for large datasets
• multiple sheets
• cell formatting (dates, currency)
• formulas if needed

---

# EXPORT PARAMETERS

Frontend sends parameters via API:

from_date (optional)
to_date (optional)
company (optional)
file_format (xlsx/csv/json)

Example request:

GET /api/v1/export/excel?from_date=2026-03-01&to_date=2026-03-10&company=Bau GmbH&file_format=xlsx

---

# WORKER SYSTEM

Export handled by background worker.

Steps:

1. Fetch filtered data from database
2. Generate Excel file using streaming writer
3. Apply formatting:
   • Dates -> YYYY-MM-DD
   • Currency -> 2 decimals, EUR
4. Save file to S3 / R2
5. Generate signed URL
6. Return download link to frontend

---

# EXCEL SHEET STRUCTURE

Sheet name: Invoices

Columns:

Invoice Number | Company | Invoice Date | Due Date | Amount Total | VAT Amount | Currency | Items Count | Status

Line items are optional in separate sheet:

Sheet name: Invoice_Items

Columns:

Invoice Number | Description | Quantity | Unit Price | Line Total

---

# CSV EXPORT

CSV uses same fields as main Excel sheet.

Comma separated, UTF-8 encoded.

Header row included.

Streaming enabled for large datasets.

---

# JSON EXPORT

JSON is array of invoice objects.

Example:

[
 {
  "invoice_number": "RE-2026-004",
  "company": "Bau GmbH",
  "amount_total": 3200,
  "vat_amount": 19,
  "currency": "EUR",
  "invoice_date": "2026-03-10",
  "due_date": "2026-04-10",
  "items": [
   {
     "description": "Construction materials",
     "quantity": 1,
     "unit_price": 3200,
     "line_total": 3200
   }
  ]
 }
]

---

# LARGE DATASETS STRATEGY

• Streaming writes prevent memory overflow
• Pagination of DB queries
• S3 storage allows download without keeping file in server memory
• Signed URLs expire after configurable time (default 24h)

---

# EXPORT API INTERFACE

GET /api/v1/export/excel

Query parameters:

from_date, to_date, company, file_format

Response:

{
 "download_url": "https://storage/docu-flow/exports/export-20260310.xlsx"
}

---

# FRONTEND EXPORT UI

Modal interface:

• Select date range
• Select company
• Choose format (Excel / CSV / JSON)
• Show progress / success notification

After generation, frontend shows download button with signed URL.

---

# SECURITY CONSIDERATIONS

• Signed URLs prevent unauthorized access
• Only authenticated users can request export
• Export filters applied per user / tenant

---

# FUTURE IMPROVEMENTS

• Multi-sheet exports for grouped reports
• Summary dashboard with totals
• Pivot tables for accounting
• Customizable templates

---

END OF PART 6

Next document:

PART 7 — SECURITY & GDPR