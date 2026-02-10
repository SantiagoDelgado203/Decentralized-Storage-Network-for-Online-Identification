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
	"node/core"
	"time"
)

// main execution
func NodeStart() (err error) {

	//Start the node
	ctx, h, _, peers := core.NodeCreate(core.ReadPrivateKeyFromFile("ID.json"), "myapp")

	//connects to peers indefinitely
	go core.ConstantConnection(ctx, h, peers)

	//allow time for connection
	time.Sleep(10 * time.Second)

	//Initialize the stream handlers
	_ = core.HandlersInit(h)

	select {}

}
