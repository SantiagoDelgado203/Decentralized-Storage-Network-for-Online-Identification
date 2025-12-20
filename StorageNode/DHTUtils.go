/**
By Santiago Delgado, December 2025

DHTUtils.go

This file is intended to have function related to the use of the nodes' DHTs

The Distributed Hash Table (DHT) is an structure used to index and share
content among nodes in the network. It keeps track of what nodes haves what data,
what we will call "providers."

When nodes need data they don't have, they will check if they are connected to any
provider of that data. If so, they will request it.

The basic structure of the DHT haves a Provider Store and Record Store.

+-------------------------------------------------------------------------------------+

Record Store is intended to store the actual data in a key:value format under
certain custom namespaces, for example:
	/
	├── fragments/
	│     ├── key → data
	│     ├── hash(password + id + positionlabel) → keyFragment
	│
	└── DataBlocks/
		  ├── hash(password + id + ???) → encrypted(userInfo)

WE MIGHT NOT NEED TO USE THE RECORD STORE. ONLY TO SHARE OPEN TERMPORARY INFORMATION

+-------------------------------------------------------------------------------------+

And then we have the Provider Store, used to know what node claims to provide
what content; CID stands for ContentID, the required format; example:

CID(HashedContent) → ProviderID
CID(#eid2ou3D@dn32i3d@n2$tg#f@3d) → [Peer QmABC, Peer QmXYZ]

+-------------------------------------------------------------------------------------+


*/

package main

import (
	"context"
	"errors"
	"fmt"

	"github.com/ipfs/go-cid"
	dht "github.com/libp2p/go-libp2p-kad-dht"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/multiformats/go-multihash"
)

/*
Generates CID from given key and then executes dht.Provide()

Node will claim to provide whatever the content is behind the CID generated from key.
*/
func DHT_provide(ctx context.Context, dht *dht.IpfsDHT, key string) (err error) {

	//generate the ContentID from the key
	mh, _ := multihash.Sum([]byte(key), multihash.SHA2_256, -1)
	c := cid.NewCidV1(cid.Raw, mh)

	if err := dht.Provide(ctx, c, true); err != nil {
		//Return error if failed to provide key
		return err
	} else {
		//Return nil error in case of success
		return nil
	}
}

/*
Generates CID from given key and then executes dht.FindProviders()

The node will either receive a list of available providers or an error.
*/
func GetProviders(ctx context.Context, dht *dht.IpfsDHT, key string) (providers_list []peer.AddrInfo, err error) {

	//generate the ContentID from the key
	mh, _ := multihash.Sum([]byte(key), multihash.SHA2_256, -1)
	c := cid.NewCidV1(cid.Raw, mh)

	fmt.Printf("🔍 Looking for providers of %s... \n", key)
	providers, err := dht.FindProviders(ctx, c)
	//Return error in case of failure
	if err != nil {
		return nil, err
	}

	if len(providers) == 0 {
		//Return new error in case no providers found
		return nil, errors.New("no providers found")
	} else {
		//Return list of providers if at least 1 was found
		return providers, nil
	}
}
