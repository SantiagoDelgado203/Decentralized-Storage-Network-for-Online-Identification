/*
By Santiago Delgado, December 2025

# StreamHandlers.go

This file defines all the handler functions that will process the different
custom communication stream protocols.
*/

package core

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"time"

	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/core/protocol"
)

/*-------------------------- BASE INTERFACE-----------------------------------*/

// Any Protocol MUST have a name and handler function
type Protocol interface {
	Name() protocol.ID
	Handler(sm *StreamsMaster) network.StreamHandler
}

// main object to use protocols
type StreamsMaster struct {
	h         host.Host
	protocols []Protocol
}

// Function to initialize stream master and set all handlers
func HandlersInit(h host.Host) *StreamsMaster {
	//create new stream master
	sm := &StreamsMaster{
		h: h,
	}

	//include all protocols
	sm.protocols = []Protocol{
		&PrintProtocol{},
		// &OtherProtocol{},
	}

	//set them all
	for _, p := range sm.protocols {
		h.SetStreamHandler(p.Name(), p.Handler(sm))
	}

	//return stream master
	return sm
}

/*-------------------------- PRINT PROTOCOL -----------------------------------*/

type PrintProtocol struct{}

// print protocol name
const PRINT_PROTOCOL = "/print/1.0.0"

// name getter
func (p *PrintProtocol) Name() protocol.ID {
	return PRINT_PROTOCOL
}

// handler for incoming print protocol messages
func (p *PrintProtocol) Handler(sm *StreamsMaster) network.StreamHandler {
	return func(s network.Stream) {
		defer s.Close()

		reader := bufio.NewReader(s)
		msg, err := reader.ReadString('\n')
		if err != nil && err != io.EOF {
			fmt.Println("Error reading:", err)
			return
		}

		fmt.Println("Received message:", msg)

		//How to reply
		//remotePeer := s.Conn().RemotePeer()
		// ctx := context.Background()

		// err = sm.PrintSend(ctx, remotePeer, "Ack from PrintProtocol")
		// if err != nil {
		// 	fmt.Println("Send error:", err)
		// }
	}
}

// function to send messages through print protocol
func (p *StreamsMaster) PrintSend(ctx context.Context, peerID peer.ID, msg string) error {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	s, err := p.h.NewStream(ctx, peerID, PRINT_PROTOCOL)
	if err != nil {
		return err
	}
	defer s.Close()

	w := bufio.NewWriter(s)
	_, err = w.WriteString(msg + "\n")
	if err != nil {
		return err
	}
	return w.Flush()
}

/*------------------------------------DATA STORE PROTOCOL-------------------------------------------*/
type DataStoreProtocol struct{}

const DATASTORE_PROTOCOL = "/data-store-protocol/1.0.0"

// name getter
func (p *DataStoreProtocol) Name() protocol.ID {
	return DATASTORE_PROTOCOL
}

// handler for incoming data store protocol dials
func (p *DataStoreProtocol) Handler(sm *StreamsMaster) network.StreamHandler {
	return func(s network.Stream) {
		defer s.Close()

		reader := bufio.NewReader(s)
		msg, err := reader.ReadString('\n')
		if err != nil && err != io.EOF {
			fmt.Println("Error reading:", err)
			return
		}
		fmt.Println("Received message:", msg)

		//TODO: Here you should decode the received msg to json and store the data block with its hash.
		//Reminder to Santiago: USE DHT PROVIDE FOR STORAGE, MODIFY STREAM MASTER TO INCLUDE DHT IN ADDITION TO LIBP2P HOST

	}
}

// function to send user data store requests to other nodes
func (p *StreamsMaster) DataStoreSend(ctx context.Context, peerID peer.ID, cipher string) error {
	return nil
}

//IS THERE ANY USE TO SEPARATING FRAGMENTS AND DATA BLOCKS IN DIFFERENT PROTOCOLS? SANTIAGO AT 1AM THINKS NO

// /*------------------------------------FRAGMENT STORE PROTOCOL-------------------------------------------*/
// type FragmentStoreProtocol struct{}

// const FRAGMENTSTORE_PROTOCOL = "/data-store-protocol/1.0.0"

// // name getter
// func (p *FragmentStoreProtocol) Name() protocol.ID {
// 	return FRAGMENTSTORE_PROTOCOL
// }

// // handler for incoming fragment store protocol dials
// func (p *FragmentStoreProtocol) Handler(sm *StreamsMaster) network.StreamHandler {
// 	return func(s network.Stream) {
// 		defer s.Close()

// 		reader := bufio.NewReader(s)
// 		msg, err := reader.ReadString('\n')
// 		if err != nil && err != io.EOF {
// 			fmt.Println("Error reading:", err)
// 			return
// 		}
// 		fmt.Println("Received message:", msg)

// 	}
// }

// // function to send key fragments store requests to other nodes
// func (p *StreamsMaster) FragmentStoreSend(ctx context.Context, peerID peer.ID, fragment string) error {
// 	return nil
// }
