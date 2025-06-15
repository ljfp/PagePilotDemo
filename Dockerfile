FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY src ./src
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install OpenSSL for Prisma compatibility
RUN apk add --no-cache openssl

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S pagepilot -u 1001

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=pagepilot:nodejs /app/dist ./dist
COPY --from=builder --chown=pagepilot:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=pagepilot:nodejs /app/package*.json ./
COPY --from=builder --chown=pagepilot:nodejs /app/prisma ./prisma
COPY --from=builder --chown=pagepilot:nodejs /app/src/generated ./dist/generated

# Create directory for SQLite database with proper permissions
RUN mkdir -p /app/data && chown pagepilot:nodejs /app/data

USER pagepilot

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "dist/index.js"] 