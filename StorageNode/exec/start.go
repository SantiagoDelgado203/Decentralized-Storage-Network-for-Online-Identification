/*
By Santiago Delgado, December 2025

start.go

This file will describe the main behavior of the node, as the main function will be the one
being executed.

The desired node behavior is as follows:
  - Will initialize/check for all necessary requirements
  - Will start libp2p node with preconfigured specifications
  - Will constantly try to connect with other nodes in the network in the background
  - Will set stream handlers to react to the different type of requests
*/
package exec

import (
	"fmt"
	"node/core"
	"time"
)

// main execution
func NodeStart() (err error) {

	//Start the node
	ctx, h, dht, peers := core.NodeCreate(core.ReadPrivateKeyFromFile("ID.json"), "myapp")

	//connects to peers indefinitely
	go core.ConstantConnection(ctx, h, peers)

	//allow time for connection
	time.Sleep(5 * time.Second)

	//Initialize the stream handlers
	// sm := core.HandlersInit(h)

	db, err := core.NewDatabase("mongodb://localhost:27017")
	if err != nil {
		panic(err)
	core.HandlersInit(h)

	test_d := "Santiago Delgado, 22 years old, bla bla bla"

	fmt.Println("\nPlaintext:", test_d)

	cipher, key, err := core.Encrypt([]byte(test_d))
	if err != nil {
		fmt.Println("Encrypt error:", err)
		return
	}

	fmt.Printf("\nKey: %x", key)
	fmt.Printf("\nCipher: %x", cipher)

	decipher, err := core.Decrypt(key, cipher)
	if err != nil {
		fmt.Println("Decrypt error:", err)
		return
	}

	fmt.Println("\nDecrypted:", string(decipher))

	test_u := "\nTesting data from user! This will be encrypted, then a hashed to be provided"
	CidHash := core.CidHash([]byte(test_u))
	fmt.Println("\nTest: ", test_u, "\nThen, the generated Cid hash: ", CidHash)
	err = core.DHTProvide(ctx, dht, CidHash)
	if err != nil {
		fmt.Println(err)
	}

	test_k := "Testing Key"
	shares := core.SplitKey([]byte(test_k), 5, 3)
	reconstruct := core.ReconstructKey(shares)
	fmt.Printf("\nKey: %s\nShares: %x\nReconstructed: %s\n", test_k, shares, reconstruct)

	fmt.Println("\nHashed Shares:")

	for i, share := range shares {
		hash := core.CidHash(share)

		fmt.Printf("Share %d hash: %s\n", i, hash)

		core.DHTProvide(ctx, dht, hash)
	}

	example := core.Fragment{
		// ID:        primitive.NewObjectID(),
		Hash:      "exmaple",
		Share:     "example",
		X:         5,
		Threshold: 3,
		Total:     5,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	db.StoreFragment(example)

	select {}

}
