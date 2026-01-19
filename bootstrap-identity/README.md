# Bootstrap Node Identity

This directory contains the identity (keypair) for the **dedicated bootstrap node**.

## Bootstrap Node Details

| Property | Value |
|----------|-------|
| **Peer ID** | `QmaTPiRLg64y6wwYXybwsQLVUqqzqwpJSNQ8k5T5e6MyAG` |
| **Generated** | January 2026 |

## Usage

### Docker Compose

The bootstrap node should mount this directory:

```yaml
services:
  storage-bootstrap:
    image: storagenode
    volumes:
      - ./bootstrap-identity:/app/data
    environment:
      - DSN_PORT=11111
      - DSN_NAMESPACE=dsn
```

### Other Nodes Connecting to Bootstrap

Other nodes should set `DSN_BOOTSTRAP_PEERS` to connect to this bootstrap node:

```bash
# For Docker (using DNS)
DSN_BOOTSTRAP_PEERS=/dns4/storage-bootstrap/tcp/11111/p2p/QmaTPiRLg64y6wwYXybwsQLVUqqzqwpJSNQ8k5T5e6MyAG

# For local network (using IP)
DSN_BOOTSTRAP_PEERS=/ip4/192.168.1.100/tcp/11111/p2p/QmaTPiRLg64y6wwYXybwsQLVUqqzqwpJSNQ8k5T5e6MyAG
```

## Files

- `ID.json` - RSA keypair (private + public key)
- `Bootstrap.txt` - List of known peers (auto-populated)

## ⚠️ Security Note

The `ID.json` file contains the **private key**. In production:
- Store this as a Docker secret or in a secure vault
- Never commit to public repositories
- Restrict file permissions (`chmod 600 ID.json`)
