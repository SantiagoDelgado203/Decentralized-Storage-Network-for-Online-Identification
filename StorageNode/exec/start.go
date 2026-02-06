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
	"bufio"
	"encoding/json"
	"fmt"
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

	selected_peer := h.Network().Peers()[0]
	fmt.Println("\n                    Selected peer" + selected_peer)

	//Initialize the stream handlers
	_ = core.HandlersInit(h)

	s, err := h.NewStream(ctx, selected_peer, "/upload/1.0.0")
	if err != nil {
		return err
	}

	type UploadRequest struct {
		Data string `json:"data"`
	}

	req := UploadRequest{
		Data: "hello distributed world",
	}

	payload, err := json.Marshal(req)

	w := bufio.NewWriter(s)
	_, err = w.WriteString(string(payload))
	if err != nil {
		fmt.Println(err)
	}
	w.Flush()
	s.Close()

	select {}

}
