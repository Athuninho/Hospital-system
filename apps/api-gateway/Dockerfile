FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY libs/prisma/package.json ./libs/prisma/

RUN pnpm install

COPY . .

RUN npx prisma generate
RUN pnpm --filter @hospital/api-gateway build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/apps/api-gateway/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main.js"]
