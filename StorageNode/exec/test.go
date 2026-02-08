package exec

import (
	"node/core"
	"time"

	"context"
	"fmt"

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

func TestNode(idseed string) (err error) {

	//TODO: init()

	priv, err := core.PrivKeyFromSeed(idseed)
	if err != nil {
		panic(err)
	}

	//Start the node
	// ctx, h, _, peers := core.NodeCreate(priv, "myapp")

	//create context
	ctx := context.Background()

	//Get priv key from ID file (specifically, from node's private key)
	// priv := readPrivateKeyFromFile("ID.json")

	//Start new node host, specifying constant ID and listening address
	h, err := libp2p.New(
		libp2p.Identity(priv),
		libp2p.ListenAddrStrings("/ip4/10.0.0.183/udp/0/quic-v1"),
		libp2p.ListenAddrStrings("/ip4/10.0.0.183/tcp/0"),
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
	_, err = dht.New(
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

	//allow time for connection
	time.Sleep(5 * time.Second)

	_ = core.HandlersInit(h)

	select {}

}
