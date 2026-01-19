/*
By Santiago Delgado, December 2025
Updated: January 2026

Utils.go

This file defines utility functions used throughout the node.
Updated to use configuration module for file paths.
*/
package core

import (
	"context"
	"crypto/ed25519"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/rand"
	"os"
	"strings"
	"time"

	"node/config"

	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/multiformats/go-multiaddr"
)

// BootstrapKeys defines the JSON structure for identity keys
type BootstrapKeys struct {
	PrivateKey string `json:"private_key"`
	PublicKey  string `json:"public_key"`
}

// PrivKeyFromSeed generates a deterministic private key from a seed string
func PrivKeyFromSeed(seed string) (crypto.PrivKey, error) {
	// Hash → 32-byte seed
	hash := sha256.Sum256([]byte(seed))

	// Ed25519 private key (64 bytes)
	edPriv := ed25519.NewKeyFromSeed(hash[:])

	// Convert to libp2p private key
	priv, err := crypto.UnmarshalEd25519PrivateKey(edPriv)
	if err != nil {
		return nil, err
	}

	return priv, nil
}

// readPrivateKeyFromFile reads the ID file and returns the private key
func readPrivateKeyFromFile(filename string) crypto.PrivKey {
	data, err := os.ReadFile(filename)
	if err != nil {
		panic(fmt.Sprintf("Failed to read key file '%s': %v", filename, err))
	}

	var keys BootstrapKeys
	if err := json.Unmarshal(data, &keys); err != nil {
		panic(fmt.Sprintf("Failed to parse JSON from '%s': %v", filename, err))
	}

	privBytes, err := base64.StdEncoding.DecodeString(keys.PrivateKey)
	if err != nil {
		panic(fmt.Sprintf("Failed to decode private key: %v", err))
	}

	priv, err := crypto.UnmarshalPrivateKey(privBytes)
	if err != nil {
		panic(fmt.Sprintf("Failed to unmarshal private key: %v", err))
	}

	return priv
}

// ReadBootstrapPeers reads bootstrap nodes from the configured file
func ReadBootstrapPeers() []string {
	cfg := config.Get()
	bootstrapFile := cfg.BootstrapFilePath()

	data, err := os.ReadFile(bootstrapFile)
	if err != nil {
		if os.IsNotExist(err) {
			return []string{}
		}
		panic(fmt.Sprintf("Failed to read bootstrap file '%s': %v", bootstrapFile, err))
	}

	lines := strings.Split(strings.TrimSpace(string(data)), "\n")
	var peers []string
	for _, line := range lines {
		if trimmed := strings.TrimSpace(line); trimmed != "" {
			peers = append(peers, trimmed)
		}
	}
	return peers
}

// AddPeerToBootstrap adds a peer address to the bootstrap file if not already present
func AddPeerToBootstrap(addr string) {
	cfg := config.Get()
	bootstrapFile := cfg.BootstrapFilePath()

	peers := ReadBootstrapPeers()
	for _, p := range peers {
		if p == addr {
			return // Already exists
		}
	}

	f, err := os.OpenFile(bootstrapFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Println("⚠️  Error writing to bootstrap file:", err)
		return
	}
	defer f.Close()

	if _, err := f.WriteString(addr + "\n"); err != nil {
		fmt.Println("⚠️  Error writing to bootstrap file:", err)
		return
	}
	fmt.Println("📝 Added self to Bootstrap.txt:", addr)
}

// ConstantConnection continuously attempts to connect to peers in the bootstrap list
func ConstantConnection(ctx context.Context, h host.Host, peers []string) {
	// Start connection counter in background
	go func() {
		for {
			select {
			case <-ctx.Done():
				fmt.Println("\n⛔ Connection monitor stopped")
				return
			default:
				conns := h.Network().Conns()
				fmt.Printf("\r🔌 Active connections: %d   ", len(conns))
				time.Sleep(1 * time.Second)
			}
		}
	}()

	// Main connection loop
	for {
		select {
		case <-ctx.Done():
			fmt.Println("\n⛔ Connection loop stopped")
			return
		default:
			for _, addr := range peers {
				// Skip self
				if strings.Contains(addr, h.ID().String()) {
					continue
				}

				ma, err := multiaddr.NewMultiaddr(addr)
				if err != nil {
					// Only log once, not on every iteration
					continue
				}

				pi, err := peer.AddrInfoFromP2pAddr(ma)
				if err != nil {
					continue
				}

				// Attempt connection (non-blocking, errors are expected for unreachable peers)
				_ = h.Connect(ctx, *pi)
			}

			time.Sleep(1 * time.Second)
		}
	}
}

func GetRandomPeer(h host.Host) peer.ID {
	// Get peers
	peers := h.Network().Peers()
	if len(peers) == 0 {
		fmt.Println("no peers connected to receive data")
	}

	admin, err := peer.AddrInfoFromString("/ip4/192.168.126.1/tcp/4001/p2p/12D3KooWA1eWrMTkfawiShux6WrxzFbRdyDsk5NAyL5indcWCtEG")
	if err != nil {
		panic("Error getting admin node")
	}
	selected := peers[rand.Intn(len(peers))]
	if selected == admin.ID {
		return GetRandomPeer(h)
	}
	return selected
}
