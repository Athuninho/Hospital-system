FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/

COPY apps/core-clinical ./apps/core-clinical
COPY libs/prisma ./libs/prisma

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @hospital/prisma build
RUN pnpm --filter @hospital/core-clinical build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/core-clinical/package.json ./apps/core-clinical/
COPY --from=builder /app/apps/core-clinical/dist ./apps/core-clinical/dist
COPY --from=builder /app/libs/prisma/dist ./libs/prisma/dist
COPY --from=builder /app/libs/prisma/package.json ./libs/prisma/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "apps/core-clinical/dist/main.js"]
