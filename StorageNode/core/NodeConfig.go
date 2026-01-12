/*
By Santiago Delgado, December 2025

StartUp.go

This file contains functions related to the starting process of a node.

If we need to change something from the configuration of a node, here it is.

*/

package core

import (
	"context"
	"fmt"

	"github.com/libp2p/go-libp2p"
	dht "github.com/libp2p/go-libp2p-kad-dht"

	// "github.com/libp2p/go-libp2p-record"

	tls "github.com/libp2p/go-libp2p/p2p/security/tls"
	quic "github.com/libp2p/go-libp2p/p2p/transport/quic"
	tcp "github.com/libp2p/go-libp2p/p2p/transport/tcp"

	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/core/protocol"
	"github.com/multiformats/go-multiaddr"
)

// Starts the p2p node listening in the passed address and creates a new custom namespace
func NodeCreate(port string, custom_namespace string) (context.Context, host.Host, *dht.IpfsDHT, []string) {
	//create context
	ctx := context.Background()

	//Get priv key from ID file (specifically, from node's private key)
	priv := readPrivateKeyFromFile("ID.json")

	//Start new node host, specifying constant ID and listening address
	h, err := libp2p.New(
		libp2p.Identity(priv),
		libp2p.ListenAddrStrings(fmt.Sprintf("/ip4/0.0.0.0/udp/%s/quic-v1", port)),
		libp2p.ListenAddrStrings(fmt.Sprintf("/ip4/0.0.0.0/tcp/%s", port)),
		//quic transpot, with tcp+tls as a fallback
		libp2p.Transport(quic.NewTransport),
		libp2p.Transport(tcp.NewTCPTransport),
		libp2p.Security(tls.ID, tls.New),
	)
	if err != nil {
		panic(err)
	}

	//get bootstrap peers from file
	bootstrapPeers := readBootstrapPeers()

	//create DHT
	kadDHT, err := dht.New(
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
		dht.NamespacedValidator(custom_namespace, LazyValidator{}),
		//Establish protocol prefix
		dht.ProtocolPrefix(protocol.ID(fmt.Sprintf("/%s", custom_namespace))),
	)
	if err != nil {
		panic(err)
	}

	fmt.Println("✅ Node ID:", h.ID())
	fmt.Println("🌐 Listening on:", h.Addrs())

	//add self to bootstrap list
	if len(h.Addrs()) > 0 {
		selfAddr := fmt.Sprintf("%s/p2p/%s", h.Addrs()[0].String(), h.ID().String())
		addPeerToBootstrap(selfAddr)
	}

	return ctx, h, kadDHT, bootstrapPeers
}
