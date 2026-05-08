# Database schema

This document summarizes the normalized PostgreSQL schema and Prisma models used for the Hospital Management System.

Key design choices:
- Use UUID primary keys for global uniqueness and easier replication across services.
- Normalize patient, staff, encounter, prescriptions, lab requests, and billing into separate tables.
- Soft deletes are supported via `deletedAt` fields on sensitive models (e.g., `Patient`).
- Audit trails are stored in `AuditLog` for compliance and forensics.
- Sensitive PHI fields should be encrypted at application level or via DB field-level encryption with KMS.

Important models:
- `Hospital` — organization tenant
- `User`, `Role`, `RefreshToken` — authentication and RBAC
- `Staff`, `Patient`, `Contact`, `Schedule`
- `Appointment`, `Visit`, `Encounter`, `Prescription`, `PrescriptionItem`
- `LabRequest`, `LabResult`, `FileAttachment`
- `Invoice`, `Payment`
- `Ward`, `Bed`, `Admission`

Indexes and performance:
- Add indexes on frequently queried columns such as `Patient.medicalRecordNumber`, `Appointment.scheduledAt`, `Staff.staffNumber`.
- Use partial indexes for active records when appropriate.
- Use read replicas and materialized views for heavy reporting queries.

Migrations:
- Use Prisma Migrate for schema evolution. Keep migration files in `prisma/migrations` and run via CI for controlled deployments.

Seeding:
- A small seed script is provided at `scripts/seed/seed.ts` to create roles, a sample hospital, a super-admin user, and a sample patient.

Next steps:
- Generate Prisma Client (`prisma generate`) and run migrations (`prisma migrate dev`).
- Implement field-level encryption for PHI using envelope encryption and a KMS provider.
