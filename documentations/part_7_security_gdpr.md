# PART 7 — SECURITY & GDPR

This document outlines security measures and GDPR compliance for Doclos.

Goals:

• protect sensitive business and personal data
• comply with EU GDPR regulations
• prevent unauthorized access and data leaks
• ensure auditability and transparency

---

# AUTHENTICATION & AUTHORIZATION

1. **JWT Tokens**

- Access token: 15 min
- Refresh token: 30 days
- Signed with secure server-side secret

2. **OAuth Integration**

- Google and Microsoft OAuth for enterprise convenience

3. **Role-based access**

- Single-user workspace for MVP
- Future multi-tenant: roles like Admin, User, Viewer

4. **Password Security**

- Store passwords hashed with bcrypt or argon2
- Minimum length: 12 characters recommended
- Rate-limiting on login attempts

---

# DATA PROTECTION

1. **At-rest encryption**

- All files in S3 / R2 encrypted using AES-256
- Database encryption for sensitive fields (company_name, invoices)

2. **In-transit encryption**

- TLS 1.2+ for all API and frontend connections

3. **Data minimization**

- Store only necessary data
- Avoid storing personal identifiers beyond required for processing

4. **Audit logs**

- Record all data changes
- Who, what, when
- Logs immutable for compliance

---

# GDPR COMPLIANCE

1. **Right to access**

- Users can request all data stored about them

2. **Right to rectification**

- Users can correct errors via validation UI

3. **Right to erasure**

- Implement endpoint: DELETE /api/v1/account
- Deletes user data and associated documents

4. **Data retention policy**

- Default retention: 7 years for invoices (typical accounting requirement)
- Ability to configure shorter retention for testing/demo users

5. **Consent management**

- Display GDPR consent banner during registration
- Record consent timestamp and version

---

# API SECURITY

1. **Rate Limiting**

- Prevent brute force and abuse
- Example: Upload 20 requests/min, Search 60 requests/min

2. **Input Validation**

- Validate all request payloads with Zod / DTO
- Sanitize inputs to prevent injection attacks

3. **CSRF / XSS Protection**

- CSRF tokens on state-changing requests
- Sanitize frontend output

4. **Error Handling**

- Do not leak sensitive info in error messages

---

# FILE STORAGE SECURITY

- Each uploaded document linked to user ID
- Access via signed URLs with expiration (default 24h)
- Prevent direct access to S3 bucket

---

# AUDITABILITY

- Track all actions:
  - Upload
  - AI extraction
  - Validation edits
  - Export downloads
- Each action includes user ID, timestamp, document ID, and change

---

# INCIDENT RESPONSE

- Logging of suspicious activity
- Alert admin for repeated failed login attempts or mass downloads
- Policy for data breach notification within 72h (per GDPR)

---

# FUTURE SECURITY IMPROVEMENTS

- Multi-factor authentication
- SSO integration for enterprise users
- Data anonymization for testing environments
- Fine-grained RBAC for teams
- Monitoring and alerting for suspicious document processing patterns

---

END OF PART 7

Next document:

PART 8 — INFRASTRUCTURE & DEPLOYMENT