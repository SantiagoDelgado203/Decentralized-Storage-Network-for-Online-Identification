/*
By Santiago Delgado, December 2025
Updated: February 2026

start.go

Main execution logic for the storage node.

The node behavior:
  - Loads configuration from environment variables
  - Starts libp2p node with configured settings
  - Starts PeerManager for automatic peer discovery and connection health monitoring
  - Sets up stream handlers for custom protocols
*/
package exec

import (
	"fmt"
	"node/config"
	"node/core"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ipfs/go-cid"
)

// NodeStart is the main execution function for the node
func NodeStart() error {
	cfg := config.Get()

	// Start the node
	ctx, h, dht, peers := core.NodeCreate()

	if cfg.HasBootstrapPeers() {
		fmt.Printf("   Bootstrap Peers: %d configured\n", len(cfg.BootstrapPeers))
	}

	// Allow time for connection
	time.Sleep(5 * time.Second)

	// Initialize the stream handlers
	_ = core.HandlersInit(ctx, h, dht)

	db, err := core.NewDatabase("mongodb://localhost:27017")
	if err != nil {
		fmt.Printf("⚠️  Warning: Could not connect to MongoDB: %v\n", err)
	} else {
		hashes, err := db.RetrieveAllHashes()
		if err != nil {
			fmt.Printf("⚠️  Warning: Error retrieving hashes from DB: %v\n", err)
		} else {
			for _, hash := range hashes {
				c, err := cid.Parse(hash)
				if err != nil {
					fmt.Printf("⚠️  Warning: Error parsing CID %s: %v\n", hash, err)
					continue
				}
				err = core.DHTProvide(ctx, dht, c)
				if err != nil {
					fmt.Println(err)
				}
			}
		}
	}

	// Allow time for initial connections and discovery
	time.Sleep(5 * time.Second)

	// Start peer manager for connection health monitoring
	peerManager := core.NewPeerManager(h, dht, peers)
	peerManager.Start()

	fmt.Println("✅ Node is running. Press Ctrl+C to stop.")

	// Start periodic network stats logging
	go logNetworkStats(peerManager)

	// Handle graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	<-sigChan
	fmt.Println("\n⛔ Shutting down...")

	// Stop peer manager
	peerManager.Stop()

	// Close host
	if err := h.Close(); err != nil {
		fmt.Printf("⚠️  Error closing host: %v\n", err)
	}

	fmt.Println("👋 Goodbye!")
	return nil
}

// logNetworkStats periodically logs network statistics
func logNetworkStats(pm *core.PeerManager) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		stats := pm.GetNetworkStats()
		fmt.Printf("📊 Network Stats: %s\n", stats.String())
	}
}
