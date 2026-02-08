/*
By Santiago Delgado, December 2025
Updated: February 2026

test.go

Test execution logic for the storage node with deterministic peer IDs.
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

// TestNode starts a test node with a deterministic peer ID from a seed
func TestNode(seed string) error {
	cfg := config.Get()

	fmt.Println("🧪 Starting Test StorageNode...")
	fmt.Printf("   Seed: %s\n", seed)
	fmt.Printf("   Port: %s\n", cfg.Port)
	fmt.Printf("   Namespace: %s\n", cfg.Namespace)

	// Generate deterministic private key from seed
	priv, err := core.PrivKeyFromSeed(seed)
	if err != nil {
		return fmt.Errorf("failed to generate key from seed: %w", err)
	}

	// Start the node with the deterministic key
	_, h, kadDHT, peers := core.NodeCreateWithPrivKey(priv, cfg.Namespace)

	// Initialize the PeerManager for connection health monitoring
	peerManager := core.NewPeerManager(h, kadDHT, peers)
	peerManager.Start()

	// Allow time for initial connections
	time.Sleep(5 * time.Second)

	// Initialize stream handlers
	core.HandlersInit(h)

	fmt.Println("✅ Test node is running. Press Ctrl+C to stop.")

	// Start periodic network stats logging
	go logTestNetworkStats(peerManager)

	// Handle graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	<-sigChan
	fmt.Println("\n⛔ Shutting down test node...")

	// Stop peer manager
	peerManager.Stop()

	// Close host
	if err := h.Close(); err != nil {
		fmt.Printf("⚠️  Error closing host: %v\n", err)
	}

	fmt.Println("👋 Goodbye!")
	return nil
}

// logTestNetworkStats periodically logs network statistics for test nodes
func logTestNetworkStats(pm *core.PeerManager) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		stats := pm.GetNetworkStats()
		fmt.Printf("📊 [TEST] Network Stats: %s\n", stats.String())
	}
}
