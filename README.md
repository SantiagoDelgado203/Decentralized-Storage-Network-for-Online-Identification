# Decentralized Storage Network for Online Identification

A peer-to-peer decentralized storage network using libp2p for secure, distributed storage of user identification data. Data is split using Shamir's Secret Sharing and distributed across multiple storage nodes.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────────────────┐
│ Web Portal  │────▶│ Admin Node  │────▶│ Storage Network (P2P)       │
│ (Next.js)   │     │ (Express)   │     │  ├── Bootstrap Node         │
│ Port: 3000  │     │ Port: 5000  │     │  ├── Storage Node 1         │
└─────────────┘     └─────────────┘     │  ├── Storage Node 2         │
                                        │  ├── Storage Node 3         │
                                        │  └── Storage Node 4         │
                                        └─────────────────────────────┘
                                                      │
                                                      ▼
                                              ┌─────────────┐
                                              │  MongoDB    │
                                              │ Port: 27018 │
                                              └─────────────┘
```

---

## Prerequisites / Dependencies

### All Team Members Need:

| Dependency | Version | Download |
|------------|---------|----------|
| **Docker Desktop** | 4.0+ | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) |
| **Git** | 2.30+ | [git-scm.com](https://git-scm.com/) |

### For Local Development (Optional):

| Dependency | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 22+ | AdminNode & Web Portal |
| **Go** | 1.21+ | StorageNode |
| **MongoDB Compass** | Latest | View stored data |

---

## Docker Hub Images

Pre-built images are available on Docker Hub (supports both **Intel** and **Apple Silicon** Macs):

| Image | Description |
|-------|-------------|
| `kanishd/dsn-storage-node` | Go libp2p storage node |
| `kanishd/dsn-admin-node` | Express.js API gateway |
| `kanishd/dsn-web-portal` | Next.js web interface |

### Pull Images (All Team Members)

```bash
docker pull kanishd/dsn-storage-node
docker pull kanishd/dsn-admin-node
docker pull kanishd/dsn-web-portal
```

### Pull All at Once

```bash
docker pull kanishd/dsn-storage-node && docker pull kanishd/dsn-admin-node && docker pull kanishd/dsn-web-portal
```

---

## Quick Start (Single Machine)

### Option A: Using Pre-built Images (Recommended)

#### 1. Clone the Repository
```bash
git clone https://github.com/your-org/Decentralized-Storage-Network-for-Online-Identification.git
cd Decentralized-Storage-Network-for-Online-Identification
```

#### 2. Pull Images and Start Services
```bash
docker pull kanishd/dsn-storage-node
docker pull kanishd/dsn-admin-node
docker pull kanishd/dsn-web-portal
docker-compose up -d
```

### Option B: Build Locally

#### 1. Clone the Repository
```bash
git clone https://github.com/your-org/Decentralized-Storage-Network-for-Online-Identification.git
cd Decentralized-Storage-Network-for-Online-Identification
```

#### 2. Build and Start All Services
```bash
docker-compose build
docker-compose up -d
```

### 3. Verify Services are Running
```bash
docker-compose ps
```

### 4. Access the Application
| Service | URL |
|---------|-----|
| Web Portal | http://localhost:3000 |
| Admin API | http://localhost:5000 |
| MongoDB | mongodb://localhost:27018 |

### 5. Test Data Upload
```bash
# Via Admin API
curl -X POST http://localhost:5000/net/upload \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "ssn": "123-45-6789"}'

# Check MongoDB for stored fragments
docker exec mongodb mongosh --quiet --eval "db.getSiblingDB('didn_storage').main.find().pretty()"
```

### 6. Stop All Services
```bash
docker-compose down
```

---

## Docker Swarm Deployment (Multiple Machines)

Docker Swarm allows you to deploy the network across multiple physical machines for true decentralization.

### Prerequisites for Swarm

- **2+ machines** (physical or VMs) on the same network
- **Docker Desktop** or **Docker Engine** installed on each machine
- **Ports open** between machines:
  - `2377/tcp` - Swarm management
  - `7946/tcp,udp` - Node communication
  - `4789/udp` - Overlay network
  - `11111/tcp,udp` - Storage nodes P2P

### Step 1: Initialize the Swarm (Manager Node)

On the **first machine** (this becomes the manager):

```bash
# Initialize swarm
docker swarm init --advertise-addr <MANAGER_IP>

# Example:
docker swarm init --advertise-addr 192.168.1.100
```

This outputs a join command. **Save it!** It looks like:
```
docker swarm join --token SWMTKN-1-xxxxx 192.168.1.100:2377
```

### Step 2: Join Worker Nodes

On **each additional machine**, run the join command from Step 1:

```bash
docker swarm join --token SWMTKN-1-xxxxx 192.168.1.100:2377
```

### Step 3: Verify the Swarm

On the manager node:
```bash
docker node ls
```

You should see all nodes listed:
```
ID             HOSTNAME    STATUS    AVAILABILITY   MANAGER STATUS
abc123 *       manager     Ready     Active         Leader
def456         worker1     Ready     Active
ghi789         worker2     Ready     Active
```

### Step 4: Create Overlay Network

```bash
docker network create --driver overlay --attachable dsn-swarm-network
```

### Step 5: Pull Images on All Machines

Each machine in the swarm needs the Docker images. Run on **every machine**:

```bash
docker pull kanishd/dsn-storage-node
docker pull kanishd/dsn-admin-node
docker pull kanishd/dsn-web-portal
```

### Step 6: Deploy the Stack

On the **manager node**:

```bash
docker stack deploy -c docker-compose.swarm.yml dsn
```

### Step 7: Verify Deployment

```bash
# Check services
docker service ls

# Check where nodes are running
docker service ps dsn_storage-node-1
docker service ps dsn_storage-node-2

# View logs
docker service logs dsn_storage-node-1
```

### Step 8: Scale Storage Nodes

```bash
# Add more storage node replicas
docker service scale dsn_storage-node=5
```

### Swarm Management Commands

```bash
# Leave swarm (on worker)
docker swarm leave

# Remove node (on manager)
docker node rm <node-id>

# Promote worker to manager
docker node promote <node-id>

# Drain node (stop scheduling new tasks)
docker node update --availability drain <node-id>

# Remove entire stack
docker stack rm dsn
```

---

## Useful Commands Reference

### Docker Compose (Local Development)

```bash
# Build all images
docker-compose build

# Start all services in background
docker-compose up -d

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f storage-node-1

# Check service status
docker-compose ps

# Restart a service
docker-compose restart admin-node

# Stop all services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

### Docker Container Commands

```bash
# List running containers
docker ps

# Execute command in container
docker exec -it storage-node-1 /bin/sh

# Check container logs
docker logs storage-node-1

# Check peer IDs
docker logs storage-node-1 2>&1 | grep "Peer ID"
```

### MongoDB Commands

```bash
# Connect to MongoDB shell
docker exec -it mongodb mongosh

# Count documents
docker exec mongodb mongosh --quiet --eval "db.getSiblingDB('didn_storage').main.countDocuments()"

# View all documents
docker exec mongodb mongosh --quiet --eval "db.getSiblingDB('didn_storage').main.find().pretty()"

# Clear all data
docker exec mongodb mongosh --quiet --eval "db.getSiblingDB('didn_storage').main.deleteMany({})"
```

### View in MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to: `mongodb://localhost:27018`
3. Navigate to: `didn_storage` → `main`

---

## Environment Variables

### Storage Nodes

| Variable | Description | Example |
|----------|-------------|---------|
| `DSN_PORT` | P2P listen port | `11111` |
| `DSN_NAMESPACE` | Network namespace | `dsn` |
| `DSN_DATA_DIR` | Data directory | `/app/data` |
| `DSN_BOOTSTRAP_PEERS` | Bootstrap node address | `/dns4/storage-bootstrap/tcp/11111/p2p/Qm...` |
| `DSN_NODE_SEED` | Seed for static peer ID | `storage-node-1` |
| `MONGO_URI` | MongoDB connection string | `mongodb://mongodb:27017` |

### Admin Node

| Variable | Description | Example |
|----------|-------------|---------|
| `ADMIN_API_PORT` | REST API port | `5000` |
| `ADMIN_P2P_PORT` | libp2p TCP port | `4001` |
| `DSN_BOOTSTRAP_PEERS` | Bootstrap node address | `/dns4/storage-bootstrap/tcp/11111/p2p/Qm...` |

---

## Troubleshooting

### Docker Desktop not running
```
Error: Cannot connect to Docker daemon
```
**Fix:** Start Docker Desktop application

### Port already in use
```
Error: Bind for 0.0.0.0:3000 failed: port is already allocated
```
**Fix:** Stop other services using that port, or change port in `docker-compose.yml`

### MongoDB not showing in Compass
Make sure you're connecting to `mongodb://localhost:27018` (not 27017) as we use port 27018 to avoid conflicts with local MongoDB.

### Storage nodes can't connect to bootstrap
Check that `storage-bootstrap` is healthy:
```bash
docker-compose ps storage-bootstrap
docker logs storage-bootstrap
```

### Line ending issues (Windows)
If you see `/bin/sh: entrypoint.sh: not found`, rebuild the images:
```bash
docker-compose build --no-cache
```

---

## Project Structure

```
├── AdminNode/           # Express.js API gateway
│   ├── src/
│   │   ├── p2p/        # libp2p node configuration
│   │   └── routes/     # API endpoints
│   └── Dockerfile
├── StorageNode/         # Go libp2p storage node
│   ├── core/           # P2P networking & protocols
│   ├── exec/           # Node initialization
│   ├── config/         # Configuration handling
│   └── Dockerfile
├── web-portal/          # Next.js frontend
│   ├── app/            # Pages and components
│   └── Dockerfile
├── bootstrap-identity/  # Pre-generated bootstrap node identity
├── docker-compose.yml   # Local development
└── README.md
```

---

## Component Documentation

### Web Portal

The Web Portal is the user-facing frontend for the Decentralized Verification Network. It allows users to register, log in, upload identity data, manage verification requests, and test network operations.

| Aspect | Details |
|--------|---------|
| **Stack** | Next.js 16, React 19, Tailwind CSS 4 |
| **Port** | 3000 |
| **Docker Image** | `kanishd/dsn-web-portal` |

#### Key Features
- **Public pages**: Landing page (`/`), login (`/login`), register (`/register`)
- **User dashboard** (`/user/dashboard`): Pending verification requests
- **Verifier dashboard** (`/verifier/dashboard`): Manage verification requests
- **Test pages** (`/test/upload`, `/test/verify`, `/test/requests`): Dev/testing for upload and verification flows

#### Local Development
```bash
cd web-portal
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

#### Configuration
- **`NEXT_PUBLIC_API_URL`**: Admin Node API base URL (e.g. `http://localhost:5000`). Set at **build time** via Docker `args` or `.env`.
- The portal calls Admin Node endpoints under `/api/*`. Ensure the Admin Node is running and CORS allows the portal origin.

#### Directory Layout
```
web-portal/
├── app/
│   ├── (public)/       # Login, register, landing
│   ├── (protected)/    # User & verifier dashboards
│   └── test/           # Dev/test pages (upload, verify, requests)
├── Connectors.ts       # API client functions (fetch wrappers)
├── Models.ts           # TypeScript types (UserInfo, Criteria, etc.)
└── next.config.ts      # Standalone output for Docker
```

---

### Admin Node

The Admin Node is the API gateway and bridge between the web portal and the P2P storage network. It exposes REST endpoints for user/verifier operations and uses libp2p to communicate with storage nodes.

| Aspect | Details |
|--------|---------|
| **Stack** | Express.js 5, TypeScript, libp2p, PostgreSQL |
| **Ports** | 5000 (API), 4001 (P2P TCP), 4002 (P2P WebSocket) |
| **Docker Image** | `kanishd/dsn-admin-node` |

#### API Endpoints

**Network (P2P-facing)**
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/net/upload` | Forward user data to storage network (encrypt, shard, distribute) |
| POST | `/api/net/verify` | Request verification from storage nodes; returns yes/no result |

**Database (PostgreSQL)**
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/db/register` | Create user account |
| POST | `/api/db/login` | Authenticate user |
| POST | `/api/db/request-verification` | Verifier creates verification request |
| POST | `/api/db/get-requests` | Get requests by user or verifier ID |
| POST | `/api/db/resolve-requests` | User accepts or rejects request |
| POST | `/api/db/update-request` | Verifier updates request criteria/status |

**Utility**
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/node-info` | libp2p node info |
| GET | `/api/peers` | Connected peers |

#### Prerequisites
- **PostgreSQL**: Admin Node uses PostgreSQL for users, providers, and requests. Set `PG_USER`, `PG_HOST`, `PG_DATABASE`, `PG_PASSWORD`, `PG_PORT` in the environment. Ensure tables `users`, `providers`, and `requests` exist.

#### Local Development
```bash
cd AdminNode
npm install
# Set PG_* and DSN_BOOTSTRAP_PEERS in .env
npm run dev
```

#### Configuration (Environment Variables)
| Variable | Description | Default |
|----------|-------------|---------|
| `ADMIN_API_PORT` | Express API port | `5000` |
| `ADMIN_P2P_PORT` | libp2p TCP port | `4001` |
| `ADMIN_P2P_WS_PORT` | libp2p WebSocket port | `4002` |
| `ADMIN_CORS_ORIGINS` | Comma-separated CORS origins | `http://localhost:3000` |
| `DSN_BOOTSTRAP_PEERS` | Bootstrap node multiaddr(s) | — |
| `DSN_NAMESPACE` | DHT namespace | `dsn` |

#### Directory Layout
```
AdminNode/
├── src/
│   ├── index.ts        # Entry point
│   ├── app.ts          # Express app & CORS
│   ├── config.ts       # Env config loader
│   ├── routes/api.ts   # All /api/* routes
│   └── p2p/node.ts     # libp2p node setup
├── Database.ts         # PostgreSQL queries
├── Models.ts           # User, Provider, DB_Request
└── SymmetricEncryption.ts
```

---

### Storage Node

The Storage Node is a Go libp2p node that participates in the P2P storage network. It stores encrypted data fragments and key shares (Shamir's Secret Sharing), provides them via DHT, and runs the verification protocol to evaluate criteria without exposing raw data.

| Aspect | Details |
|--------|---------|
| **Stack** | Go 1.25, libp2p, Kademlia DHT, MongoDB |
| **Port** | 11111 (TCP + UDP/QUIC) |
| **Docker Image** | `kanishd/dsn-storage-node` |

#### Commands
```bash
# One-time init (creates ID.json, Bootstrap.txt)
./storagenode init

# Start the node
./storagenode run

# Test with deterministic PeerID from seed
./storagenode test <seed>
```

Docker uses `entrypoint.sh`, which runs `init` if `ID.json` is missing, then executes the given command (default: `run`).

#### Protocols
| Protocol | Path | Role |
|----------|------|------|
| Print | `/print/1.0.0` | Debug/echo |
| Upload | `/upload/1.0.0` | Receive user data; encrypt, shard, distribute |
| Store | `/store/1.0.0` | Store encrypted blob or key fragment; provide CID in DHT |
| Resource | `/resource/1.0.0` | Retrieve blob by hash |
| Verification | `/verification/1.0.0` | Fetch data + fragments, decrypt, run criteria, return yes/no |

#### Data Flow
- **Upload**: Data → encrypt → store cipher + provide CID; key → Shamir (5-of-3) → store fragments + provide CIDs
- **Verification**: Lookup CIDs in DHT → fetch cipher + 3 key fragments → reconstruct key → decrypt → evaluate criteria → return result only

#### Prerequisites
- **MongoDB**: Storage nodes use MongoDB (`didn_storage.main`) for encrypted data and key fragments. Set `MONGO_URI` (e.g. `mongodb://mongodb:27017` in Docker).

#### Local Development
```bash
cd StorageNode
go build -o storagenode .

# First run
./storagenode init

# Start (ensure MongoDB is running; set MONGO_URI if needed)
MONGO_URI=mongodb://localhost:27017 ./storagenode run
```

#### Configuration (Environment Variables)
| Variable | Description | Default |
|----------|-------------|---------|
| `DSN_PORT` | P2P listen port | `11111` |
| `DSN_NAMESPACE` | DHT namespace | `dsn` |
| `DSN_DATA_DIR` | Data directory (ID.json, Bootstrap.txt) | `.` / `/app/data` |
| `DSN_BOOTSTRAP_PEERS` | Bootstrap multiaddr(s) | — |
| `DSN_NODE_SEED` | Seed for deterministic peer ID (Docker) | — |
| `DSN_ANNOUNCE_ADDRESSES` | External announce addrs (NAT/Docker) | — |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017` |

#### Directory Layout
```
StorageNode/
├── main.go             # CLI entry (init, run, test)
├── entrypoint.sh       # Docker init + run
├── config/config.go    # Env config
├── exec/
│   ├── init.go         # Identity generation
│   ├── start.go        # Node startup, handlers, peer manager
│   └── test.go         # Test node
└── core/
    ├── NodeConfig.go   # libp2p host creation
    ├── StreamHandlers.go   # Protocol handlers
    ├── Database.go     # MongoDB operations
    ├── Crypto.go       # Encryption, Shamir
    ├── PeerDiscovery.go
    ├── VerificationEngine.go
    └── Models.go
```

---

## License

