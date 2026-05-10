FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web ./apps/web

RUN pnpm install --frozen-lockfile

# Note: Next.js build requires environment variables if they are used at build time
# ENV NEXT_PUBLIC_API_URL=...

RUN pnpm --filter @hospital/web build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Next.js standalone build is more efficient
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
