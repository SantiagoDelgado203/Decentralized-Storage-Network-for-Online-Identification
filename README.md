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

## Quick Start (Single Machine)

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/Decentralized-Storage-Network-for-Online-Identification.git
cd Decentralized-Storage-Network-for-Online-Identification
```

### 2. Build and Start All Services
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

### Step 5: Deploy the Stack

```bash
# Build images first (on manager)
docker-compose build

# Deploy to swarm
docker stack deploy -c docker-compose.swarm.yml dsn
```

### Step 6: Verify Deployment

```bash
# Check services
docker service ls

# Check where nodes are running
docker service ps dsn_storage-node-1
docker service ps dsn_storage-node-2

# View logs
docker service logs dsn_storage-node-1
```

### Step 7: Scale Storage Nodes

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

## License

MIT License
