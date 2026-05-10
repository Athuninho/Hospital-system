FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/ws-server/package.json ./apps/ws-server/

RUN pnpm install

COPY . .

RUN pnpm --filter @hospital/ws-server build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/ws-server/dist ./dist
COPY --from=builder /app/apps/ws-server/package.json ./package.json

EXPOSE 3002

CMD ["node", "dist/main.js"]
