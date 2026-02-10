# StorageNode Dockerfile
# Multi-stage build for minimal production image

# ============================================
# Stage 1: Build
# ============================================
FROM golang:1.25-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git ca-certificates

WORKDIR /build

# Copy go mod files first for better caching
COPY go.mod go.sum ./
RUN go mod download && go mod tidy

# Copy source code
COPY . .

# Build the binary
# CGO_ENABLED=0 for static binary
# -ldflags="-s -w" for smaller binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o storagenode .

# ============================================
# Stage 2: Runtime
# ============================================
FROM alpine:3.19

# Install ca-certificates for TLS
RUN apk add --no-cache ca-certificates

# Create non-root user for security
RUN adduser -D -u 1000 storagenode

WORKDIR /app

# Copy binary from builder
COPY --from=builder /build/storagenode /app/storagenode

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh

# Create data directory and set permissions
RUN mkdir -p /app/data && \
    chmod +x /app/entrypoint.sh && \
    chown -R storagenode:storagenode /app

# Switch to non-root user
USER storagenode

# Default environment variables
ENV DSN_PORT=11111
ENV DSN_METRICS_PORT=9090
ENV DSN_NAMESPACE=dsn
ENV DSN_DATA_DIR=/app/data
# DSN_BOOTSTRAP_PEERS should be set at runtime
# DSN_ANNOUNCE_ADDRESSES should be set at runtime for Docker

# Expose P2P ports (TCP and QUIC/UDP) and metrics port
EXPOSE 11111/tcp
EXPOSE 11111/udp
EXPOSE 9090/tcp

# Volume for persistent data (ID.json, Bootstrap.txt)
VOLUME ["/app/data"]

# Health check - verify process is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD pgrep storagenode || exit 1

# Default command: auto-init and run
# entrypoint.sh handles initialization if ID.json doesn't exist
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["run"]
