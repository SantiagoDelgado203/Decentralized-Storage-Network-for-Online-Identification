/*
By Santiago Delgado, December 2025

# Utils.go

This file will define a variety of functions utilized in different contexts.
*/
package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/multiformats/go-multiaddr"
)

// struct to define json structure of keys
type BootstrapKeys struct {
	PrivateKey string `json:"private_key"`
	PublicKey  string `json:"public_key"`
}

// path to file with list of boostrap nodes
var bootstrapFile = "Bootstrap.txt"

// will read the ID.json, fetch the private key, and return it in crypto.PrivKey format
func readPrivateKeyFromFile(filename string) crypto.PrivKey {
	data, err := os.ReadFile(filename)
	if err != nil {
		panic(fmt.Sprintf("Failed to read key file: %v", err))
	}

	var keys BootstrapKeys
	if err := json.Unmarshal(data, &keys); err != nil {
		panic(fmt.Sprintf("Failed to parse JSON: %v", err))
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

// gets bootstrap nodes from file, returns list of strings
func readBootstrapPeers() []string {
	data, err := os.ReadFile(bootstrapFile)
	if err != nil {
		if os.IsNotExist(err) {
			return []string{}
		}
		panic(fmt.Sprintf("Failed to read bootstrap file: %v", err))
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

// writes the node address to the bootstrap list
func addPeerToBootstrap(addr string) {
	peers := readBootstrapPeers()
	for _, p := range peers {
		if p == addr {
			return
		}
	}
	f, err := os.OpenFile(bootstrapFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Println("Error writing to bootstrap file:", err)
		return
	}
	defer f.Close()
	if _, err := f.WriteString(addr + "\n"); err != nil {
		fmt.Println("Error writing to bootstrap file:", err)
		return
	}
	fmt.Println("📝 Added self to Bootstrap.txt:", addr)
}

// endlessly connects to nodes in the bootstrap list
func constantConnection(ctx context.Context, h host.Host, peers []string) {
	go func() {
		for {
			select {
			case <-ctx.Done():
				fmt.Println("\n⛔ constantConnection stopped by context")
				return
			default:
				conns := h.Network().Conns()
				fmt.Printf("\r🔌 Active connections: %d", len(conns))
				time.Sleep(1 * time.Second)
			}
		}
	}()

	// main connection loop
	for {
		select {
		case <-ctx.Done():
			fmt.Println("\n⛔ constantConnection stopped by context")
			return
		default:

			for _, addr := range peers {
				if strings.Contains(addr, h.ID().String()) {
					continue
				}

				ma, err := multiaddr.NewMultiaddr(addr)
				if err != nil {
					fmt.Println("Invalid multiaddr:", addr)
					continue
				}

				pi, err := peer.AddrInfoFromP2pAddr(ma)
				if err != nil {
					fmt.Println("Invalid peer info:", addr)
					continue
				}

				_ = h.Connect(ctx, *pi)
			}

			time.Sleep(5 * time.Second)
		}
	}
}
