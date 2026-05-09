Core Clinical Modules (backend scaffold)

Quick start

Install dependencies from workspace root (pnpm / npm / pnpm workspace):

```bash
pnpm --filter @hospital/core-clinical install
pnpm --filter @hospital/core-clinical dev
```

This folder contains a minimal NestJS-style scaffold for core clinical modules:
- Patients
- Encounters
- Orders

Endpoints are mounted under `/api/core-clinical`.
