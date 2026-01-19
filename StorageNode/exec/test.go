/*
By Santiago Delgado, December 2025
Updated: January 2026

test.go

Test execution logic for the storage node with deterministic peer IDs.
*/
package exec

import (
	"fmt"
	"node/config"
	"node/core"
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
	ctx, h, dht, peers := core.NodeCreateWithPrivKey(priv, cfg.Namespace)

	// Initialize PeerManager for health monitoring
	pm := core.NewPeerManager(h, dht, peers)
	pm.Start()

	// Allow time for initial connections
	time.Sleep(5 * time.Second)

	// Initialize stream handlers
	core.HandlersInit(h)

	fmt.Println("✅ Test node is running. Press Ctrl+C to stop.")

	// Keep ctx reference to prevent unused variable warning
	_ = ctx

	// Block forever (node runs until interrupted)
	select {}
}
