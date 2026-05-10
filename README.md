# Hospital Management System (Monorepo)

This repository contains a monorepo scaffold for the Hospital Management System.

Workspaces:
- `apps/api-gateway` — NestJS REST + GraphQL API gateway
- `apps/ws-server` — WebSocket gateway / real-time server
- `apps/worker` — background workers (BullMQ)
- `libs/prisma` — Prisma client wrapper

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 8+
- Docker & Docker Compose

### Local Development
1. Install dependencies: `pnpm install`
2. Set up environment: `cp .env.example .env`
3. Generate Prisma client: `pnpm --filter @hospital/prisma prisma generate`
4. Run dev servers: `pnpm dev`

### Running with Docker
```bash
docker-compose up --build
```

## Project Status
- [x] Monorepo Foundation
- [x] Database Schema (Prisma/Postgres)
- [x] Authentication (JWT/RBAC/MFA)
- [x] Patient Dashboard (List, Register, Profile)
- [x] Dockerization (Compose/Microservices)
- [ ] Appointment System (Pending)
- [ ] Billing & M-Pesa (Pending)

