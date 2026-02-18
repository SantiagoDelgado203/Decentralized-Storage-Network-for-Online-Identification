# Decentralized Storage Network for Online Identification

A peer-to-peer decentralized storage network built with libp2p for secure online identity verification.

## Architecture

- **StorageNode** (Go) - P2P storage nodes that form the network
- **AdminNode** (TypeScript/Express) - API gateway for interacting with the network
- **Web Portal** (Next.js) - User-facing frontend

## Quick Start with Docker

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Commands

**Build all images:**
```bash
docker-compose build
```

**Start all services:**
```bash
docker-compose up -d
```

**Start with multiple storage nodes:**
```bash
docker-compose up -d --scale storage-node=3
```

**View logs:**
```bash
docker-compose logs -f
```

**Stop everything:**
```bash
docker-compose down
```

### Access Points

| Service | URL |
|---------|-----|
| Web Portal | http://localhost:3000 |
| Admin API | http://localhost:5000 |
| Bootstrap Node | localhost:11111 (P2P) |

## Local Development (Without Docker)

### StorageNode

```bash
cd StorageNode
go mod download
go run . init    # First time only - generates identity
go run . run     # Start the node
```

### AdminNode

```bash
cd AdminNode
npm install
npm run dev
```

### Web Portal

```bash
cd web-portal
npm install
npm run dev
```

## Environment Variables

### StorageNode
| Variable | Default | Description |
|----------|---------|-------------|
| `DSN_PORT` | `11111` | P2P listening port |
| `DSN_NAMESPACE` | `dsn` | DHT namespace |
| `DSN_DATA_DIR` | `.` | Directory for identity and data |
| `DSN_BOOTSTRAP_PEERS` | - | Comma-separated bootstrap peer addresses |

### AdminNode
| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_API_PORT` | `5000` | Express API port |
| `ADMIN_P2P_PORT` | `4001` | libp2p TCP port |
| `ADMIN_CORS_ORIGINS` | `http://localhost:3000` | Allowed CORS origins |
