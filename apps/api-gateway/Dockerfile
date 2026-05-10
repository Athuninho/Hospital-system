FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root config and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/

# Copy all packages/apps for context
COPY apps/api-gateway ./apps/api-gateway
COPY libs/prisma ./libs/prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the shared library and then the app
RUN pnpm --filter @hospital/prisma build
RUN pnpm --filter @hospital/api-gateway build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/api-gateway/package.json ./apps/api-gateway/
COPY --from=builder /app/apps/api-gateway/dist ./apps/api-gateway/dist
COPY --from=builder /app/libs/prisma/dist ./libs/prisma/dist
COPY --from=builder /app/libs/prisma/package.json ./libs/prisma/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "apps/api-gateway/dist/main.js"]
