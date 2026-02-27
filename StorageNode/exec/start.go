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

	//Start the node
	ctx, h, dht, peers := core.NodeCreate(core.ReadPrivateKeyFromFile("ID.json"), "myapp")

	if cfg.HasBootstrapPeers() {
		fmt.Printf("   Bootstrap Peers: %d configured\n", len(cfg.BootstrapPeers))
	}

	//allow time for connection
	time.Sleep(5 * time.Second)

	//Initialize the stream handlers
	_ = core.HandlersInit(ctx, h, dht)

	db, err := core.NewDatabase("mongodb://localhost:27017")
	hashes, err := db.RetrieveAllHashes()
	if err != nil {
		panic("error retrieving hashes from DB")
	}

	for _, hash := range hashes {
		cid, err := cid.Parse(hash)
		err = core.DHTProvide(ctx, dht, cid)
		if err != nil {
			fmt.Println(err)
		}
	}

	// result, err := db.RetrieveSimpleData("bafkreiaao5wnf7fd3ad7dlfo654biir5xsqr7lbyoooklkdbc577jk4me4")

	// fmt.Println(result[0].Data)

	// Allow time for initial connections and discovery
	time.Sleep(5 * time.Second)

	// Initialize stream handlers
	core.HandlersInit(h)

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
