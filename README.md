# Decentralized Storage Network for Online Identification

A privacy-first, distributed identity management system that allows users to own and control their personal identification data. Third-party **Providers** (companies, services) can request access to specific user data fields, while users retain full authority to approve or deny those requests — no centralized authority holds your data.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Database Setup](#database-setup)
  - [Running the Admin Node](#running-the-admin-node)
  - [Running the Storage Node](#running-the-storage-node)
  - [Running the Web Portal](#running-the-web-portal)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Online identity verification today relies on centralized silos — your data is held by corporations, governments, or third-party brokers with little transparency. This project takes a different approach:

- **Users** register and store their identity data across a decentralized network of storage nodes.
- **Providers** (e.g., banks, apps, employers) register on the network and submit structured data requests.
- **Requests** are scoped to only the fields the provider actually needs (via JSONB `datarequests`), giving users fine-grained visibility into what is being asked for.
- An **Admin Node** orchestrates node registration, request routing, and system-level management.

The result is a verifiable, auditable, and user-controlled identity layer for the modern web.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Web Portal (TypeScript)            │
│         User registration · Provider login           │
│         Request dashboard · Approval flow            │
└────────────────────┬────────────────────────────────┘
                     │ HTTP / REST
         ┌───────────┴────────────┐
         │                        │
┌────────▼────────┐    ┌──────────▼──────────┐
│   Admin Node    │    │   Storage Node(s)    │
│   (Go)          │    │   (Go)               │
│                 │    │                      │
│ · Node registry │    │ · Identity storage   │
│ · Auth          │    │ · Data retrieval     │
│ · Request mgmt  │    │ · Peer replication   │
│ · Provider API  │    │                      │
└────────┬────────┘    └──────────────────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │
│   Database      │
│                 │
│ · users         │
│ · providers     │
│ · requests      │
└─────────────────┘
```

**Key design decisions:**

- The Admin Node handles orchestration, authentication, and request management, keeping storage nodes lightweight and focused.
- Storage Nodes handle the actual persistence of identity data, and can be scaled horizontally.
- The Web Portal provides a user-facing interface for registration, login, and reviewing/approving provider data requests.

---

## Project Structure

```
Decentralized-Storage-Network-for-Online-Identification/
├── AdminNode/          # Go service — orchestration, auth, provider management
├── StorageNode/        # Go service — identity data storage and retrieval
├── web-portal/         # TypeScript frontend — user & provider web interface
├── schema.sql          # PostgreSQL schema dump
└── README.md
```

### AdminNode (Go)

The central coordination service. Responsible for:

- Registering and authenticating **users** and **providers**
- Routing data requests from providers to the appropriate storage node
- Managing the lifecycle of identity requests (`pending` → `approved` / `rejected`)
- Exposing REST APIs consumed by the Web Portal

### StorageNode (Go)

A lightweight, horizontally-scalable storage peer. Responsible for:

- Persisting user identity data (encrypted at rest)
- Responding to retrieval requests from the Admin Node
- Participating in the distributed node network

### web-portal (TypeScript)

A browser-based application providing:

- **User flows**: registration, login, identity data management, and reviewing incoming provider requests
- **Provider flows**: registration, login, and submitting scoped identity data requests
- Communicates with the Admin Node over REST

---

## Database Schema

The PostgreSQL database (managed via `schema.sql`) contains three core tables:

### `users`

Represents individuals who store their identity on the network.

| Column | Type | Description |
|---|---|---|
| `userid` | `uuid` (PK) | Auto-generated unique identifier |
| `email` | `varchar(255)` | Unique user email address |
| `hashedpassword` | `varchar(255)` | Bcrypt-hashed password |

### `providers`

Represents organizations that request access to user identity data.

| Column | Type | Description |
|---|---|---|
| `providerid` | `uuid` (PK) | Auto-generated unique identifier |
| `registeredname` | `varchar(255)` | Unique registered company/service name |
| `hashedpassword` | `varchar(255)` | Bcrypt-hashed password |
| `provideremail` | `varchar(255)` | Provider contact email |

### `requests`

Tracks every access request a provider submits to a user.

| Column | Type | Description |
|---|---|---|
| `requestid` | `uuid` (PK) | Auto-generated unique identifier |
| `providerid` | `uuid` (FK → providers) | The requesting provider |
| `companyname` | `varchar(255)` | Display name shown to the user |
| `userid` | `uuid` (FK → users) | The user whose data is being requested |
| `datarequests` | `jsonb` | JSON object specifying which identity fields are requested |
| `status` | `varchar(50)` | Request state: `pending`, `approved`, or `rejected` |

The `datarequests` JSONB column allows providers to declaratively specify only the fields they need (e.g., `{"name": true, "dob": true, "address": false}`), giving users clear and auditable visibility into what is being asked for.

---

## How It Works

1. **User Registration** — A user signs up on the Web Portal. Their credentials are stored in the `users` table (password hashed); their identity data is stored on a Storage Node.

2. **Provider Registration** — A company registers as a Provider via the Web Portal. Their credentials are stored in the `providers` table.

3. **Provider Submits a Request** — A Provider creates a request targeting a specific user, specifying which identity fields they need via the `datarequests` JSON payload. The request is persisted with `status = 'pending'`.

4. **User Reviews the Request** — The user logs into the Web Portal and sees all pending requests. The request displays the provider's name and exactly which data fields are being asked for.

5. **User Approves or Rejects** — The user takes action; the request `status` is updated to `approved` or `rejected`.

6. **Provider Retrieves Data** — Upon approval, the provider can retrieve the granted data fields from the Storage Node via the Admin Node API.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend / Admin Node | Go |
| Backend / Storage Node | Go |
| Frontend | TypeScript |
| Database | PostgreSQL 18 |
| Auth | UUID-based sessions, bcrypt password hashing |

---

## Getting Started

### Prerequisites

- [Go](https://go.dev/dl/) 1.21+
- [Node.js](https://nodejs.org/) 18+ and npm
- [PostgreSQL](https://www.postgresql.org/download/) 14+

### Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE identity_network;
```

2. Apply the schema:

```bash
psql -U postgres -d identity_network -f schema.sql
```

This creates the `users`, `providers`, and `requests` tables with all constraints and sequences.

### Running the Admin Node

```bash
cd AdminNode
go mod tidy
go run .
```

The Admin Node will start on its configured port (default: check `AdminNode` source for env vars or config file). Configure your database connection string via environment variable:

```bash
export DATABASE_URL="postgres://postgres:password@localhost:5432/identity_network"
```

### Running the Storage Node

```bash
cd StorageNode
go mod tidy
go run .
```

Storage Nodes register themselves with the Admin Node on startup. You can run multiple Storage Node instances on different ports to simulate a distributed network.

### Running the Web Portal

```bash
cd web-portal
npm install
npm run dev
```

The portal will be available at `http://localhost:3000` (or the port configured in the project).

---




This project is currently unlicensed. Please contact the repository owner for usage permissions.
