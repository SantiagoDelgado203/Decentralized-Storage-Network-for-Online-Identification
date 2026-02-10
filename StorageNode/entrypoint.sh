#!/bin/sh
# Entrypoint script for StorageNode Docker container
# Automatically initializes the node if ID.json doesn't exist

set -e

DATA_DIR="${DSN_DATA_DIR:-/app/data}"
ID_FILE="$DATA_DIR/ID.json"

# Auto-initialize if identity doesn't exist
if [ ! -f "$ID_FILE" ]; then
    echo "ðŸ”§ No identity found, initializing..."
    /app/storagenode init
fi

# Execute the command (default: run)
exec /app/storagenode "$@"
