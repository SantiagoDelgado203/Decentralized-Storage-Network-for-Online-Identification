/*
By Santiago Delgado, December 2025
Updated: February 2026

test.go

Test execution logic for the storage node with deterministic peer IDs.
*/
package exec

import (
	"context"
	"fmt"
	"node/config"
	"node/core"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ipfs/go-cid"
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
	ctx, h, kadDHT, peers := core.NodeCreateWithPrivKey(priv, cfg.Namespace)

	fmt.Println("✅ Node ID:", h.ID())
	fmt.Println("🌐 Listening on:", h.Addrs())

	// Add self to bootstrap list
	if len(h.Addrs()) > 0 {
		selfAddr := fmt.Sprintf("%s/p2p/%s", h.Addrs()[0].String(), h.ID().String())
		core.AddPeerToBootstrap(selfAddr)
	}

	// Initialize the PeerManager for automatic peer discovery and health monitoring
	peerManager := core.NewPeerManager(h, kadDHT, peers)
	peerManager.Start()

	// Initialize stream handlers
	core.HandlersInit(ctx, h, kadDHT)

	// Allow time for connection
	time.Sleep(5 * time.Second)

	// Connect to MongoDB and provide stored hashes
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
				err = core.DHTProvide(ctx, kadDHT, c)
				if err != nil {
					fmt.Println(err)
				}
			}
		}
	}

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

// TestVerification is a helper to test verification requests
func TestVerification(ctx context.Context) {
	// Commented out test code - uncomment to test verification flow
	// verification := core.VerificationRequest{
	// 	UserID: "9a3fc47b-98b2-4d51-bb5e-a4a641812ebb",
	// 	Criteria: core.Criteria{
	// 		All: []core.Rule{
	// 			{
	// 				Field: "Name",
	// 				Type:  "equal",
	// 				Value: "Santiago",
	// 			},
	// 		},
	// 		Any: nil,
	// 	},
	// }
	// sm.VerificationSend(ctx, h.Network().Peers()[0], verification)
}
