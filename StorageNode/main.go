/*
By Santiago Delgado, December 2025

main.go

This file will describe the main behavior of the node, as the main function will be the one
being executed.

The desired node behavior is as follows:
  - Will initialize/check for all necessary requirements
  - Will start libp2p node with preconfigured specifications
  - Will constantly try to connect with other nodes in the network in the background
  - Will set stream handlers to react to the different type of requests
*/
package main

import (
	"bufio"
	"fmt"
	"time"

	"github.com/libp2p/go-libp2p/core/peer"
)

// main execution
func main() {

	//TODO: init()

	//Start the node
	ctx, h, _, peers := node_start("11111", "myapp")

	//connects to peers indefinitely
	go constantConnection(ctx, h, peers)

	//allow time for connection
	time.Sleep(5 * time.Second)

	peerID, err := peer.Decode("12D3KooWPyBkFNSq6YdzB7SiJBobp4rVDi6Ts8YLmnV69tyHZRgX")
	if err != nil {
		fmt.Println("invalid peer ID:", err)
	}

	s, err := h.NewStream(ctx, peerID, "/get-peer-list-protocol/1.0.0")
	if err != nil {
		fmt.Println("failed to open stream:", err)
		return
	}
	defer s.Close()

	w := bufio.NewWriter(s)
	_, err = w.WriteString("hey\n")
	if err != nil {
		fmt.Println("write failed:", err)
		return
	}
	w.Flush()

	//Initialize the stream handlers
	sm := HandlersInit(h)

	//Example usage of print protocol
	for {
		peerID, err := peer.Decode("QmPFryeZzQ1UmzKr8NbFZny6iJ42rXSbJ3M68a4gijjGmq")
		if err != nil {
			fmt.Println("invalid peer ID:", err)
			break
		}
		err = sm.PrintSend(ctx, peerID, "Hello from Stream Master")
		if err != nil {
			fmt.Println(err)
		}
		time.Sleep(2 * time.Second)
	}

	select {}

}
