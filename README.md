# Hospital Management System (Monorepo)

This repository contains a monorepo scaffold for the Hospital Management System.

Workspaces:
- `apps/api-gateway` — NestJS REST + GraphQL API gateway
- `apps/ws-server` — WebSocket gateway / real-time server
- `apps/worker` — background workers (BullMQ)
- `libs/prisma` — Prisma client wrapper

Next steps:
- Install dependencies with your preferred package manager (pnpm recommended for workspaces).
- Generate Prisma client: `npx prisma generate`
- Run local development: `pnpm -w -r dev` or use per-app scripts.
