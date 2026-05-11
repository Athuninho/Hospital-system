# 🏥 Coast General Hospital HMS - Mombasa, Kenya

A high-performance, modular, and production-grade Hospital Management System built as a monorepo. It leverages a microservices-inspired architecture to handle clinical workflows, patient EMR, billing, and real-time laboratory management.

---

## 🚀 Technology Stack

### Core Frameworks
- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router, Client/Server Components)
- **Backend Services**: [NestJS](https://nestjs.com/) (Node.js framework for scalable server-side apps)
- **Database ORM**: [Prisma 7](https://www.prisma.io/) (with the new `prisma.config.ts` system)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)

### Infrastructure & Tools
- **Database**: PostgreSQL (Primary EMR data)
- **Caching & Messaging**: Redis (Caching and BullMQ background tasks)
- **Auth**: JWT with Multi-Factor Authentication (MFA/TOTP)
- **Package Manager**: [pnpm](https://pnpm.io/) (Workspace monorepo)

---

## 🏗️ Architecture Overiew

The system is split into specialized workspaces under `apps/` and `libs/`:

### Applications (`apps/`)
- **`web`**: The user dashboard for Doctors, Nurses, and Administrators.
- **`api-gateway`**: The entry point for the REST API, handling authentication, MFA, and request routing.
- **`core-clinical`**: Handles clinical logic, patient encounters, prescriptions, and lab requests.
- **`ws-server`**: WebSocket server for real-time notifications (e.g., live queue updates).
- **`worker`**: Processes background tasks like email notifications and PDF reports via BullMQ.

### Libraries (`libs/`)
- **`prisma`**: A shared library containing the Prisma client and database services used across all backend microservices.

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js 20+**
- **pnpm 9+**
- **PostgreSQL & Redis** (Running locally or via Docker)

### 2. Installation
```bash
pnpm install
```

### 3. Environment Configuration
Copy the example environment file and update your database credentials:
```bash
cp .env.example .env
```

### 4. Database Setup
Sync your schema and generate the Prisma Client:
```bash
npx prisma db push
pnpm --filter @hospital/prisma build
```

---

## 🏃 Running the System

To start the development environment, open separate terminals for the core services:

```bash
# Terminal 1: API Gateway
pnpm --filter @hospital/api-gateway dev

# Terminal 2: Clinical Service
pnpm --filter @hospital/core-clinical dev

# Terminal 3: Web Frontend
pnpm --filter web dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## ✅ Project Status & Roadmap

- [x] **Monorepo Architecture**: pnpm workspaces with shared libs.
- [x] **Authentication**: Secure JWT, RBAC, and MFA (TOTP).
- [x] **Patient Management**: Registration, EMR profiles, and history.
- [x] **Clinical Module**: Patient encounters and diagnostic notes.
- [x] **Prisma 7 Migration**: Modern configuration and type-safe queries.
- [x] **UI/UX**: Premium shadcn/ui design system with Tailwind 4.
- [x] **Appointment System**: Live queue management.
- [x] **Billing Module**: M-Pesa STK Push & Bank reconciliation.
- [x] **Inventory**: Pharmacy and laboratory stock management.


