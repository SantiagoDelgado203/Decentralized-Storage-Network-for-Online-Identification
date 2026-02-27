/*
By Santiago Delgado, December 2025
Updated: February 2026

test.go

Test execution logic for the storage node with deterministic peer IDs.
*/
package exec

import (
	"fmt"

	"github.com/ipfs/go-cid"
	"github.com/libp2p/go-libp2p"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/core/protocol"
	"github.com/multiformats/go-multiaddr"

	dht "github.com/libp2p/go-libp2p-kad-dht"

	// "github.com/libp2p/go-libp2p-record"

	tls "github.com/libp2p/go-libp2p/p2p/security/tls"
	quic "github.com/libp2p/go-libp2p/p2p/transport/quic"
	tcp "github.com/libp2p/go-libp2p/p2p/transport/tcp"
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

	// Initialize the PeerManager for automatic peer discovery and health monitoring
	peerManager := core.NewPeerManager(h, kadDHT, peers)
	peerManager.Start()

	//Get priv key from ID file (specifically, from node's private key)
	// priv := readPrivateKeyFromFile("ID.json")

	//Start new node host, specifying constant ID and listening address
	h, err := libp2p.New(
		libp2p.Identity(priv),
		libp2p.ListenAddrStrings("/ip4/127.0.0.1/udp/0/quic-v1"),
		libp2p.ListenAddrStrings("/ip4/127.0.0.1/tcp/0"),
		//quic transpot, with tcp+tls as a fallback
		libp2p.Transport(quic.NewTransport),
		libp2p.Transport(tcp.NewTCPTransport),
		libp2p.Security(tls.ID, tls.New),
	)
	if err != nil {
		panic(err)
	}

	//get bootstrap peers from file
	bootstrapPeers := core.ReadBootstrapPeers()

	//create DHT
	dht, err := dht.New(
		ctx,
		h,
		//IMPORTANT! Use ModeAutoServer. Will function as Server by defaul, allowing to receive and send requests/responses
		dht.Mode(dht.ModeAutoServer),
		//Bootstrap know nodes in DHT
		dht.BootstrapPeers(func() []peer.AddrInfo {
			var bootstrap_addresses []peer.AddrInfo

			for p := range bootstrapPeers {
				ma, err := multiaddr.NewMultiaddr(bootstrapPeers[p])
				if err != nil {
					panic(err)
				}

				pi, err := peer.AddrInfoFromP2pAddr(ma)
				if err != nil {
					panic(err)
				}
				bootstrap_addresses = append(bootstrap_addresses, *pi)
			}

			return bootstrap_addresses
		}()...),
		//Pass custom validator for custom prefix
		dht.NamespacedValidator("myapp", core.LazyValidator{}),
		//Establish protocol prefix
		dht.ProtocolPrefix(protocol.ID(fmt.Sprintf("/%s", "myapp"))),
	)
	if err != nil {
		panic(err)
	}

	fmt.Println("✅ Node ID:", h.ID())
	fmt.Println("🌐 Listening on:", h.Addrs())

	//add self to bootstrap list
	if len(h.Addrs()) > 0 {
		selfAddr := fmt.Sprintf("%s/p2p/%s", h.Addrs()[0].String(), h.ID().String())
		core.AddPeerToBootstrap(selfAddr)
	}

	//connects to peers indefinitely
	go core.ConstantConnection(ctx, h, bootstrapPeers)

	core.HandlersInit(ctx, h, dht)
	//allow time for connection
	time.Sleep(5 * time.Second)

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

	// request := core.ResourceRequest{
	// 	Hash: "bafkreiaao5wnf7fd3ad7dlfo654biir5xsqr7lbyoooklkdbc577jk4me4",
	// }

	// sm.ResourceSend(ctx, h.Network().Peers()[0], request)

	// time.Sleep(15 * time.Second)

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
