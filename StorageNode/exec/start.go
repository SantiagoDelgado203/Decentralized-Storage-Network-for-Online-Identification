/*
By Santiago Delgado, December 2025
Updated: January 2026

start.go

Main execution logic for the storage node.

The node behavior:
  - Loads configuration from environment variables
  - Starts libp2p node with configured settings
  - Continuously connects to bootstrap peers
  - Sets up stream handlers for custom protocols
*/
package exec

import (
	"fmt"
	"node/config"
	"node/core"
	"time"
)

// NodeStart is the main execution function for the node
func NodeStart() error {
	cfg := config.Get()

	fmt.Println("🚀 Starting StorageNode...")
	fmt.Printf("   Port: %s\n", cfg.Port)
	fmt.Printf("   Namespace: %s\n", cfg.Namespace)
	fmt.Printf("   Data Dir: %s\n", cfg.DataDir)

	if cfg.HasBootstrapPeers() {
		fmt.Printf("   Bootstrap Peers: %d configured\n", len(cfg.BootstrapPeers))
	}

	// Start the node using configuration
	ctx, h, dht, peers := core.NodeCreate()

	// Initialize PeerManager for health monitoring
	pm := core.NewPeerManager(h, dht, peers)
	pm.Start()

	// Allow time for initial connections
	time.Sleep(5 * time.Second)

	// Initialize stream handlers
	core.HandlersInit(h)

	fmt.Println("✅ Node is running. Press Ctrl+C to stop.")

	// Block forever (node runs until interrupted)
	select {}
}
