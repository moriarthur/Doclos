# PART 2 — DATA MODEL & DATABASE DESIGN

This section defines the full database schema and data structures used by the system.

Design goals:

Consistency
Traceability
Scalability
LLM provenance tracking
Human validation support

Database engine:

PostgreSQL

Why PostgreSQL:

Strong relational model
JSONB support
Full‑text search
Excellent reliability

---

# CORE ENTITIES

The system is centered around these entities:

users
customers
documents
invoices
invoice_items
jobs
audit_logs
field_extractions

---

# USERS TABLE

Represents application users.

Fields:

id (UUID, PK)
email
name
password_hash
oauth_provider
oauth_id
created_at
last_login

Example SQL:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT,
  oauth_provider TEXT,
  oauth_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);
```

---

# CUSTOMERS TABLE

Stores companies extracted from documents.

Fields:

id
name
tax_id
vat_id
address
city
country
created_at

Example:

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  tax_id TEXT,
  vat_id TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

# DOCUMENTS TABLE

Represents uploaded files.

Fields:

id
user_id
customer_id
type
status
original_filename
s3_key
mime_type
file_size
page_count
created_at
processed_at

Example SQL:

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  customer_id UUID REFERENCES customers(id),
  type TEXT,
  status TEXT,
  original_filename TEXT,
  s3_key TEXT,
  mime_type TEXT,
  file_size INTEGER,
  page_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);
```

---

# INVOICES TABLE

Stores structured invoice data extracted from documents.

Fields:

id
document_id
invoice_number
invoice_date
due_date
amount_total
vat_amount
currency
supplier_name
supplier_address
validated
created_at

Example SQL:

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id),
  invoice_number TEXT,
  invoice_date DATE,
  due_date DATE,
  amount_total NUMERIC(12,2),
  vat_amount NUMERIC(12,2),
  currency TEXT,
  supplier_name TEXT,
  supplier_address TEXT,
  validated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

# INVOICE ITEMS TABLE

Each invoice can contain multiple line items.

Fields:

id
invoice_id
description
quantity
unit_price
line_total

Example SQL:

```sql
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id),
  description TEXT,
  quantity NUMERIC(10,2),
  unit_price NUMERIC(10,2),
  line_total NUMERIC(10,2)
);
```

---

# FIELD_EXTRACTIONS TABLE

This table stores the raw extraction results from OCR/LLM for each field.

Purpose:

Track confidence
Track source
Allow debugging
Enable human validation

Fields:

id
document_id
field_name
value
confidence
source
snippet
created_at

Example SQL:

```sql
CREATE TABLE field_extractions (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id),
  field_name TEXT,
  value TEXT,
  confidence NUMERIC(3,2),
  source TEXT,
  snippet TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Example row:

field_name: invoice_number
value: RE‑2026‑004
confidence: 0.94
source: llm
snippet: "Rechnung Nr. RE‑2026‑004"

---

# JOBS TABLE

Tracks background jobs.

Fields:

id
job_type
status
document_id
attempts
last_error
created_at
updated_at

Example SQL:

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  job_type TEXT,
  status TEXT,
  document_id UUID REFERENCES documents(id),
  attempts INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);
```

---

# AUDIT LOGS TABLE

Tracks all changes to extracted data.

Fields:

id
entity_type
entity_id
user_id
action
old_value
new_value
created_at

Example SQL:

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  entity_type TEXT,
  entity_id UUID,
  user_id UUID REFERENCES users(id),
  action TEXT,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

# RELATIONSHIP DIAGRAM (LOGICAL)

users
  │
  └── documents
        │
        └── invoices
              │
              └── invoice_items

customers
  │
  └── documents

---

# INDEX STRATEGY

Indexes required for fast queries.

Examples:

```sql
CREATE INDEX idx_documents_user
ON documents(user_id);

CREATE INDEX idx_invoices_number
ON invoices(invoice_number);

CREATE INDEX idx_invoices_date
ON invoices(invoice_date);

CREATE INDEX idx_customers_name
ON customers(name);
```

Full text search index:

```sql
CREATE INDEX idx_customer_search
ON customers
USING GIN (to_tsvector('english', name));
```

---

# DATA VALIDATION RULES

Invoice number must not be empty.

Invoice date must be valid ISO date.

Total amount must be >= 0.

VAT must be between 0 and 100.

Sum of invoice_items should approximately equal total amount.

Tolerance allowed: 0.5%.

---

# CONFIDENCE SYSTEM

Each extracted field includes a confidence score.

Range:

0.0 – 1.0

Interpretation:

>0.85 auto accepted

0.6–0.85 requires validation

<0.6 flagged as low confidence

Confidence is calculated using:

OCR token probability
LLM extraction reliability
Pattern validation

---

# HUMAN VALIDATION WORKFLOW

If confidence is low:

Document status becomes:

needs_validation

User interface shows:

PDF viewer
Editable fields
Confidence indicators

User edits values and confirms.

System writes audit log.

---

END OF PART 2

Next section will define:

AI Pipeline
OCR architecture
LLM prompt templates
Document classification system
Processing orchestration

