# AdminNode Dockerfile
# Multi-stage build for minimal production image

# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build 2>/dev/null || echo "No build script, using tsx in production"

# ============================================
# Stage 2: Runtime
# ============================================
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user (uid 1001 to avoid conflict with node user)
RUN adduser -D -u 1001 adminnode

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy source code (using tsx to run TypeScript directly)
COPY --from=builder /build/src ./src
COPY --from=builder /build/tsconfig.json ./

# Install tsx for running TypeScript
RUN npm install tsx

# Set ownership
RUN chown -R adminnode:adminnode /app

# Switch to non-root user
USER adminnode

# Default environment variables
ENV ADMIN_API_PORT=5000
ENV ADMIN_P2P_PORT=4001
ENV ADMIN_P2P_WS_PORT=4002
ENV ADMIN_CORS_ORIGINS=http://localhost:3000
ENV DSN_NAMESPACE=dsn
# DSN_BOOTSTRAP_PEERS should be set at runtime

# Expose ports
EXPOSE 5000
EXPOSE 4001
EXPOSE 4002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget -q --spider http://localhost:5000/health || exit 1

# Start with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["npx", "tsx", "src/index.ts"]
