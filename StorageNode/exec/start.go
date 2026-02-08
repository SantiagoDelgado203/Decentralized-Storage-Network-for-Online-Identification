/*
By Santiago Delgado, December 2025
Updated: February 2026

start.go

Main execution logic for the storage node.

The node behavior:
  - Loads configuration from environment variables
  - Starts libp2p node with configured settings
  - Starts PeerManager for connection health monitoring
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
	_, h, kadDHT, peers := core.NodeCreate()

	// Initialize the PeerManager for connection health monitoring
	peerManager := core.NewPeerManager(h, kadDHT, peers)
	peerManager.Start()

	// Allow time for initial connections
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
