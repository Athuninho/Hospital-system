FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/

RUN pnpm install

COPY . .

# Next.js build
RUN pnpm --filter @hospital/web build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# We only need the public folder, .next/static and .next/standalone
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000

# Set the port
ENV PORT 3000

# Start Next.js
CMD ["node", "apps/web/server.js"]
