# Use Node.js 20 base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root configurations
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy package.json of relevant apps/libs
COPY apps/core-clinical/package.json ./apps/core-clinical/
COPY libs/prisma/package.json ./libs/prisma/

# Install dependencies
RUN pnpm install

# Copy entire source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the core-clinical app
RUN pnpm --filter @hospital/core-clinical build

# Final production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/core-clinical/dist ./dist
COPY --from=builder /app/apps/core-clinical/package.json ./package.json

# Expose the service port
EXPOSE 3001

# Start the application
CMD ["node", "dist/main.js"]
