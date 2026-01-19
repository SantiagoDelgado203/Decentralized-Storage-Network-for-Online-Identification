/*
By Santiago Delgado, December 2025
Updated: January 2026

NodeConfig.go

This file contains functions related to the starting process of a node.
Now supports configuration via environment variables for Docker deployment.
*/

package core

import (
	"context"
	"fmt"

	"node/config"

	"github.com/libp2p/go-libp2p"
	dht "github.com/libp2p/go-libp2p-kad-dht"

	tls "github.com/libp2p/go-libp2p/p2p/security/tls"
	quic "github.com/libp2p/go-libp2p/p2p/transport/quic"
	tcp "github.com/libp2p/go-libp2p/p2p/transport/tcp"

	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/core/protocol"
	"github.com/multiformats/go-multiaddr"
)

// NodeCreate starts the p2p node using configuration from environment
// Returns context, host, DHT, and list of bootstrap peers
func NodeCreate() (context.Context, host.Host, *dht.IpfsDHT, []string) {
	cfg := config.Get()
	return NodeCreateWithConfig(cfg.Port, cfg.Namespace)
}

// NodeCreateWithPrivKey starts the p2p node with a provided private key
// Used for test nodes with deterministic peer IDs
func NodeCreateWithPrivKey(priv crypto.PrivKey, customNamespace string) (context.Context, host.Host, *dht.IpfsDHT, []string) {
	cfg := config.Get()

	// Create context
	ctx := context.Background()

	port := cfg.Port

	// Build listen addresses
	listenAddrs := []string{
		fmt.Sprintf("/ip4/0.0.0.0/udp/%s/quic-v1", port),
		fmt.Sprintf("/ip4/0.0.0.0/tcp/%s", port),
	}

	// Build libp2p options
	opts := []libp2p.Option{
		libp2p.Identity(priv),
		libp2p.ListenAddrStrings(listenAddrs...),
		// QUIC transport with TCP+TLS as fallback
		libp2p.Transport(quic.NewTransport),
		libp2p.Transport(tcp.NewTCPTransport),
		libp2p.Security(tls.ID, tls.New),
	}

	// Add announce addresses if configured (for Docker/NAT)
	if cfg.HasAnnounceAddresses() {
		var announceAddrs []multiaddr.Multiaddr
		for _, addr := range cfg.AnnounceAddresses {
			ma, err := multiaddr.NewMultiaddr(addr)
			if err != nil {
				fmt.Printf("⚠️  Invalid announce address: %s (%v)\n", addr, err)
				continue
			}
			announceAddrs = append(announceAddrs, ma)
		}
		if len(announceAddrs) > 0 {
			opts = append(opts, libp2p.AddrsFactory(func([]multiaddr.Multiaddr) []multiaddr.Multiaddr {
				return announceAddrs
			}))
		}
	}

	// Start new node host
	h, err := libp2p.New(opts...)
	if err != nil {
		panic(fmt.Sprintf("Failed to create libp2p host: %v", err))
	}

	// Get bootstrap peers (from env first, then file)
	bootstrapPeers := getBootstrapPeers(cfg)

	// Create DHT
	kadDHT, err := dht.New(
		ctx,
		h,
		// Use ModeAutoServer - functions as server by default
		dht.Mode(dht.ModeAutoServer),
		// Bootstrap with known nodes
		dht.BootstrapPeers(parseBootstrapPeers(bootstrapPeers)...),
		// Custom validator for namespace
		dht.NamespacedValidator(customNamespace, LazyValidator{}),
		// Protocol prefix
		dht.ProtocolPrefix(protocol.ID(fmt.Sprintf("/%s", customNamespace))),
	)
	if err != nil {
		panic(fmt.Sprintf("Failed to create DHT: %v", err))
	}

	fmt.Println("✅ Node ID:", h.ID())
	fmt.Println("🌐 Listening on:", h.Addrs())

	if cfg.HasAnnounceAddresses() {
		fmt.Println("📢 Announcing:", cfg.AnnounceAddresses)
	}

	// Add self to bootstrap file (for local development)
	if len(h.Addrs()) > 0 {
		selfAddr := fmt.Sprintf("%s/p2p/%s", h.Addrs()[0].String(), h.ID().String())
		addPeerToBootstrap(selfAddr)
	}

	return ctx, h, kadDHT, bootstrapPeers
}

// NodeCreateWithConfig starts the p2p node with explicit port and namespace
// This allows for manual override when needed
func NodeCreateWithConfig(port string, customNamespace string) (context.Context, host.Host, *dht.IpfsDHT, []string) {
	cfg := config.Get()

	// Create context
	ctx := context.Background()

	// Get private key from ID file
	priv := readPrivateKeyFromFile(cfg.IDFilePath())

	// Build listen addresses
	listenAddrs := []string{
		fmt.Sprintf("/ip4/0.0.0.0/udp/%s/quic-v1", port),
		fmt.Sprintf("/ip4/0.0.0.0/tcp/%s", port),
	}

	// Build libp2p options
	opts := []libp2p.Option{
		libp2p.Identity(priv),
		libp2p.ListenAddrStrings(listenAddrs...),
		// QUIC transport with TCP+TLS as fallback
		libp2p.Transport(quic.NewTransport),
		libp2p.Transport(tcp.NewTCPTransport),
		libp2p.Security(tls.ID, tls.New),
	}

	// Add announce addresses if configured (for Docker/NAT)
	if cfg.HasAnnounceAddresses() {
		var announceAddrs []multiaddr.Multiaddr
		for _, addr := range cfg.AnnounceAddresses {
			ma, err := multiaddr.NewMultiaddr(addr)
			if err != nil {
				fmt.Printf("⚠️  Invalid announce address: %s (%v)\n", addr, err)
				continue
			}
			announceAddrs = append(announceAddrs, ma)
		}
		if len(announceAddrs) > 0 {
			opts = append(opts, libp2p.AddrsFactory(func([]multiaddr.Multiaddr) []multiaddr.Multiaddr {
				return announceAddrs
			}))
		}
	}

	// Start new node host
	h, err := libp2p.New(opts...)
	if err != nil {
		panic(fmt.Sprintf("Failed to create libp2p host: %v", err))
	}

	// Get bootstrap peers (from env first, then file)
	bootstrapPeers := getBootstrapPeers(cfg)

	// Create DHT
	kadDHT, err := dht.New(
		ctx,
		h,
		// Use ModeAutoServer - functions as server by default
		dht.Mode(dht.ModeAutoServer),
		// Bootstrap with known nodes
		dht.BootstrapPeers(parseBootstrapPeers(bootstrapPeers)...),
		// Custom validator for namespace
		dht.NamespacedValidator(customNamespace, LazyValidator{}),
		// Protocol prefix
		dht.ProtocolPrefix(protocol.ID(fmt.Sprintf("/%s", customNamespace))),
	)
	if err != nil {
		panic(fmt.Sprintf("Failed to create DHT: %v", err))
	}

	fmt.Println("✅ Node ID:", h.ID())
	fmt.Println("🌐 Listening on:", h.Addrs())

	if cfg.HasAnnounceAddresses() {
		fmt.Println("📢 Announcing:", cfg.AnnounceAddresses)
	}

	// Add self to bootstrap file (for local development)
	if len(h.Addrs()) > 0 {
		selfAddr := fmt.Sprintf("%s/p2p/%s", h.Addrs()[0].String(), h.ID().String())
		addPeerToBootstrap(selfAddr)
	}

	return ctx, h, kadDHT, bootstrapPeers
}

// getBootstrapPeers returns bootstrap peers from config (env) or file
func getBootstrapPeers(cfg *config.Config) []string {
	// Environment variable takes precedence
	if cfg.HasBootstrapPeers() {
		fmt.Println("📋 Using bootstrap peers from environment")
		return cfg.BootstrapPeers
	}

	// Fall back to file
	fmt.Println("📋 Using bootstrap peers from file")
	return readBootstrapPeers()
}

// parseBootstrapPeers converts multiaddr strings to peer.AddrInfo
// Supports both /ip4/ and /dns4/ addresses
func parseBootstrapPeers(peers []string) []peer.AddrInfo {
	var bootstrapAddrs []peer.AddrInfo

	for _, peerAddr := range peers {
		ma, err := multiaddr.NewMultiaddr(peerAddr)
		if err != nil {
			fmt.Printf("⚠️  Invalid bootstrap multiaddr: %s (%v)\n", peerAddr, err)
			continue
		}

		pi, err := peer.AddrInfoFromP2pAddr(ma)
		if err != nil {
			fmt.Printf("⚠️  Invalid bootstrap peer info: %s (%v)\n", peerAddr, err)
			continue
		}

		bootstrapAddrs = append(bootstrapAddrs, *pi)
	}

	return bootstrapAddrs
}
