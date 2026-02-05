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
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
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
		&UploadProtocol{},
		&StoreProtocol{},
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

/*------------------------------------UPLOAD PROTOCOL----------------------------------------------*/
type UploadProtocol struct{}

const UPLOAD_PROTOCOL = "/upload/1.0.0"

// name getter
func (p *UploadProtocol) Name() protocol.ID {
	return UPLOAD_PROTOCOL
}

type UploadRequest struct {
	Data []byte `json:"data"`
}

// handler for incoming new user protocol dials
func (p *UploadProtocol) Handler(sm *StreamsMaster) network.StreamHandler {
	return func(s network.Stream) {
		defer s.Close()

		//SYED

		// read payload (plain json string)
		// reader := bufio.NewReader(s)
		// msg, err := reader.ReadString('\n')
		// if err != nil && err != io.EOF {
		// 	fmt.Println("Error reading:", err)
		// 	return
		// }
		// See what was read
		//fmt.Println("Received message:", raw)

		// //json object for go
		// var data Fragment

		// //convert from json string to the object
		// err = json.Unmarshal([]byte(msg), &data)
		// if err != nil {
		// 	fmt.Println("error:", err)
		// 	return
		// }
		// 2. Parse the JSON request
		//TODO: split key into fragments.
		//TODO: generate hashes from user id and labels. then, distribute user cipher and key fragments to other nodes

		// 1. Read Payload
		reader := bufio.NewReader(s)
		raw, err := reader.ReadBytes('\n')
		if err != nil && err != io.EOF {
			fmt.Println("Read error:", err)
			return
		}

		// 2. Parse JSON
		var req UploadRequest
		if err := json.Unmarshal(raw, &req); err != nil {
			fmt.Println("JSON error:", err)
			return
		}

		// 3. Encrypt Data
		cipher, key, err := Encrypt(req.Data)
		if err != nil {
			fmt.Println("Encrypt error:", err)
			return
		}

		// 4. Generate Hash
		cid := CidHash(cipher).String()

		// 5. Create Encrypted Data
		blob := DataBlock{
			Hash:   cid,
			Cipher: base64.StdEncoding.EncodeToString(cipher),
		}
		// Send to Blob storage network
		if err := sm.StoreSend(context.Background(), blob); err != nil {
			fmt.Println("Error handing off DataBlock:", err)
		}

		// 6. Split Key
		const total = 5
		const threshold = 3
		shares := SplitKey(key, total, threshold)

		for i, share := range shares {
			fp := Fragment{
				Hash:      cid,
				Share:     base64.StdEncoding.EncodeToString(share),
				X:         i + 1, // Needed to reconstruct key, must store
				Threshold: threshold,
				Total:     total,
			}

			// Send fragments to storage network
			if err := sm.StoreSend(context.Background(), fp); err != nil {
				fmt.Printf("Error sending fragment %d: %v\n", i+1, err)
			}
		}
		fmt.Println("Uploaded Data")
	}
}

func (sm *StreamsMaster) StoreSend(ctx context.Context, payload interface{}) error {
	// 1. Check if anyone is online
	peers := sm.h.Network().Peers()
	if len(peers) == 0 {
		return fmt.Errorf("no peers connected to receive data")
	}

	// 2. Pick a random peer to store this chunk
	targetPeer := peers[rand.Intn(len(peers))]

	// 3. Dial them on the Store Protocol
	s, err := sm.h.NewStream(ctx, targetPeer, STORE_PROTOCOL)
	if err != nil {
		return err
	}
	defer s.Close()

	// 4. Send the JSON
	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	writer := bufio.NewWriter(s)
	writer.Write(data)
	writer.WriteString("\n")
	return writer.Flush()
}

// function to send upload protocol (Not needed?)
func (p *StreamsMaster) UploadSend(ctx context.Context, peerID peer.ID) error {
	return nil
}

/*------------------------------------STORE  ----------------------------------------------*/

type StoreProtocol struct{}

const STORE_PROTOCOL = "/store/1.0.0"

// name getter
func (p *StoreProtocol) Name() protocol.ID {
	return STORE_PROTOCOL
}

// handler for incoming store protocol dials
func (p *StoreProtocol) Handler(sm *StreamsMaster) network.StreamHandler {
	return func(s network.Stream) {
		defer s.Close()
		//Mo: your logic here
	}
}
