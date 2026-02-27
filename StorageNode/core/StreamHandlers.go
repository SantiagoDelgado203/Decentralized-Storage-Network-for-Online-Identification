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
	"os"
	"time"

	"github.com/ipfs/go-cid"
	dht "github.com/libp2p/go-libp2p-kad-dht"
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
	dht       *dht.IpfsDHT
	ctx       context.Context
	protocols []Protocol
}

// Function to initialize stream master and set all handlers
func HandlersInit(ctx context.Context, h host.Host, dht *dht.IpfsDHT) *StreamsMaster {
	//create new stream master
	sm := &StreamsMaster{
		h:   h,
		dht: dht,
		ctx: ctx,
	}

	//include all protocols
	sm.protocols = []Protocol{
		&PrintProtocol{},
		&UploadProtocol{},
		&StoreProtocol{},
		&ResourceProtocol{},
		&VerificationProtocol{},
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

// handler for incoming new user protocol dials
func (p *UploadProtocol) Handler(sm *StreamsMaster) network.StreamHandler {
	return func(s network.Stream) {
		defer s.Close()

		reader := bufio.NewReader(s)
		raw, err := reader.ReadBytes('\n')
		if err != nil && err != io.EOF {
			fmt.Println("Read error:", err)
			return
		}

		// fmt.Printf("\nIncoming data: %s", raw)

		uploaded := UploadRequest{}

		err = json.Unmarshal(raw, &uploaded)
		if err != nil {
			fmt.Println("Error unmarshaling upload")
		}

		data, err := json.Marshal(uploaded.Data)

		cipher, key, err := Encrypt([]byte(data))
		if err != nil {
			fmt.Println("Encrypt error:", err)
			return
		}

		// fmt.Println("Generated key: ", key)

		cid := DataHash(uploaded.UserID).String()

		blob := SimpleData{
			Hash: cid,
			Data: base64.StdEncoding.EncodeToString(cipher),
		}

		// fmt.Printf("\nGenerated encrypted data: %s\n", blob.Data)

		if err := sm.StoreSend(context.Background(), GetRandomPeer(sm.h), blob); err != nil {
			fmt.Println("Error handling off DataBlock:", err)
		}

		const total = 5
		const threshold = 3
		shares := SplitKey(key, total, threshold)

		for i, share := range shares {
			cid := FragmentHash(uploaded.UserID, i).String()
			fp := SimpleData{
				Hash: cid,
				Data: base64.StdEncoding.EncodeToString(share),
			}

			// fmt.Printf("\nKey fragment: %s\n", fp.Data)

			// Send fragments to storage network
			if err := sm.StoreSend(context.Background(), GetRandomPeer(sm.h), fp); err != nil {
				fmt.Printf("Error sending fragment %d: %v\n", i+1, err)
			}
		}
		fmt.Println("Data uploaded.")
	}
}

// function to send upload protocol (Not needed?)
func (p *StreamsMaster) UploadSend(ctx context.Context, peerID peer.ID) error {
	return nil
}

/*------------------------------------STORE PROTOCOL ----------------------------------------------*/

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

		reader := bufio.NewReader(s)
		raw, err := reader.ReadBytes('\n')
		if err != nil && err != io.EOF {
			fmt.Println("Read error:", err)
			return
		}

		simpleData := SimpleData{}
		err = json.Unmarshal(raw, &simpleData)
		if err != nil {
			panic("Error parsing json to object")
		}

		fmt.Printf("\nI received a data block or key fragment: %s\n", simpleData.Data)

		mongoURI := os.Getenv("MONGO_URI")
		if mongoURI == "" {
			mongoURI = "mongodb://localhost:27017"
		}
		db, err := NewDatabase(mongoURI)

		err = db.StoreSimple(simpleData)
		if err != nil {
			panic(err)
		}

		cid, err := cid.Decode(simpleData.Hash)
		err = DHTProvide(sm.ctx, sm.dht, cid)
		if err != nil {
			panic(err)
		}

	}
}

func (sm *StreamsMaster) StoreSend(ctx context.Context, peerID peer.ID, payload interface{}) error {

	s, err := sm.h.NewStream(ctx, peerID, STORE_PROTOCOL)
	if err != nil {
		return err
	}
	defer s.Close()

	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	writer := bufio.NewWriter(s)
	writer.Write(data)
	writer.WriteString("\n")
	return writer.Flush()
}

/*------------------------------------RESOURCE PROTOCOL----------------------------------------------*/

type ResourceProtocol struct{}

const RESOURCE_PROTOCOL = "/resource/1.0.0"

// name getter
func (p *ResourceProtocol) Name() protocol.ID {
	return RESOURCE_PROTOCOL
}

// handler for incoming store protocol dials
func (p *ResourceProtocol) Handler(sm *StreamsMaster) network.StreamHandler {
	return func(s network.Stream) {
		defer s.Close()

		reader := bufio.NewReader(s)
		raw, err := reader.ReadBytes('\n')
		if err != nil && err != io.EOF {
			fmt.Println("Read error:", err)
			return
		}

		resource_request := ResourceRequest{}
		err = json.Unmarshal(raw, &resource_request)
		if err != nil {
			panic(err)
		}

		res_hash := resource_request.Hash

		db, err := NewDatabase("mongodb://localhost:27017")
		if err != nil {
			panic(err)
		}
		resource, err := db.RetrieveSimpleData(res_hash)
		if err != nil {
			panic(err)
		}

		json_resource, err := json.Marshal(resource[0])

		writer := bufio.NewWriter(s)
		writer.Write(json_resource)
		writer.WriteString("\n")
		writer.Flush()
		s.CloseWrite()

	}
}

func (sm *StreamsMaster) ResourceSend(ctx context.Context, peerID peer.ID, request ResourceRequest) (data SimpleData, err error) {
	s, err := sm.h.NewStream(ctx, peerID, RESOURCE_PROTOCOL)
	if err != nil {
		fmt.Print(err)
		return SimpleData{}, err
	}
	defer s.Close()

	payload, err := json.Marshal(request)
	if err != nil {
		return SimpleData{}, err
	}
	writer := bufio.NewWriter(s)
	writer.Write(payload)
	writer.WriteString("\n")
	writer.Flush()
	s.CloseWrite()

	reader := bufio.NewReader(s)
	resp, err := reader.ReadString('\n')
	if err != nil {
		fmt.Println("Error reading response:", err)
		return
	}

	// fmt.Printf("Resource we got: %s\n", resp)

	res_json := SimpleData{}

	err = json.Unmarshal([]byte(resp), &res_json)
	if err != nil {
		fmt.Println("error unmarshaling", err)
	}

	return res_json, nil

}

/*------------------------------------VERIFICATION PROTOCOL----------------------------------------------*/

type VerificationProtocol struct{}

const VERIFICATION_PROTOCOL = "/verification/1.0.0"

// name getter
func (p *VerificationProtocol) Name() protocol.ID {
	return VERIFICATION_PROTOCOL
}

// handler for incoming store protocol dials
func (p *VerificationProtocol) Handler(sm *StreamsMaster) network.StreamHandler {
	return func(s network.Stream) {
		defer s.Close()

		//get raw input (should be a marshaled VerificationRequest)
		reader := bufio.NewReader(s)
		raw, err := reader.ReadBytes('\n')
		if err != nil && err != io.EOF {
			fmt.Println("Read error:", err)
			return
		}
		s.CloseRead()

		//unmarshal it to an object
		verification_request := VerificationRequest{}
		err = json.Unmarshal(raw, &verification_request)
		if err != nil {
			fmt.Println(err)
			panic("")
		}
		fmt.Println("\nVerification request: ", verification_request)
		//get id and set parameters (in the future these will be gotten from .env or something like that)
		user_id := verification_request.UserID
		const SHARES_NUMBER = 5      //example quantity of fragments
		const REQUIRED_FRAGMENTS = 3 //threshold

		//generate hash for user encrypted data and fragmets
		data_hash := DataHash(user_id)
		fragments_hash := []cid.Cid{}
		for i := range SHARES_NUMBER {
			fragments_hash = append(fragments_hash, FragmentHash(user_id, i))
		}
		//try to find providers for the encrypted data
		data_providers, err := DHTGetProviders(sm.ctx, sm.dht, data_hash)
		if len(data_providers) == 0 {
			panic("NO ENCRYPTED DATA PROVIDERS FOUND")
		}
		//if providers found, then ask for it until found
		//MAYBE: for the future, use go routines for parallel execution. might be faster!
		var user_data SimpleData

		for _, provider := range data_providers {
			fetch, err := sm.ResourceSend(sm.ctx, provider.ID, ResourceRequest{Hash: data_hash.String()})
			if err == nil {
				user_data = fetch
				break

			}
		}

		if user_data == (SimpleData{}) {
			panic("USER DATA NOT FOUND")
		}

		//look for key fragments providers
		key_fragments_providers := [][]peer.AddrInfo{}

		for _, hash := range fragments_hash {
			fetch, err := DHTGetProviders(sm.ctx, sm.dht, hash)
			if err == nil {
				key_fragments_providers = append(key_fragments_providers, fetch)
			}
		}

		if len(key_fragments_providers) == 0 {
			panic("NO KEY FRAGMENTS PROVIDERS FOUND")
		}

		//ask for the fragments to the providers
		var key_fragments []SimpleData

		for i, fragment := range key_fragments_providers {
			for _, provider := range fragment {
				fetch, err := sm.ResourceSend(sm.ctx, provider.ID, ResourceRequest{Hash: fragments_hash[i].String()})
				if err == nil {
					key_fragments = append(key_fragments, fetch)
					break
				}
			}
		}

		if len(key_fragments) == REQUIRED_FRAGMENTS {
			panic("NOT ENOUGH FRAGMENTS FOR KEY RECOVERY")
		}

		//if enough fragments, get the fragments values
		var fragments_values []string
		for _, fragment := range key_fragments {
			fragments_values = append(fragments_values, fragment.Data)
		}

		//recover the key from fragments
		var shares [][]byte
		for _, share := range fragments_values {
			str, _ := base64.StdEncoding.DecodeString(share)
			shares = append(shares, str)
		}
		key := ReconstructKey(shares)
		//decrypt data
		cipher, err := base64.StdEncoding.DecodeString(user_data.Data)
		decrypted_data, err := Decrypt([]byte(key), cipher)
		if err != nil {
			fmt.Println("Something went wrong with decryption: ", err)
			panic("")
		}

		// fmt.Println(string(decrypted_data))

		criteria := verification_request.Criteria

		var data map[string]any

		err = json.Unmarshal(decrypted_data, &data)
		if err != nil {
			fmt.Println("Error unmarshaling data: ", err)
		}

		agent := &VerificationAgent{}

		verified := agent.Verify(data, criteria)

		fmt.Println("\nResult: ", verified)

		var res = map[string]any{
			"response": "Success",
			"result":   verified,
		}

		json_res, err := json.Marshal(res)
		if err != nil {
			fmt.Println("Error marshaling json response")
		}

		writer := bufio.NewWriter(s)
		writer.Write(json_res)
		writer.WriteString("\n")
		writer.Flush()
		s.CloseWrite()
	}
}

// May be not needed. Admin Node is the only one that should be sending verification requests
func (sm *StreamsMaster) VerificationSend(ctx context.Context, peerID peer.ID, request VerificationRequest) error {
	s, err := sm.h.NewStream(ctx, peerID, VERIFICATION_PROTOCOL)
	if err != nil {
		fmt.Print(err)
		return err
	}
	defer s.Close()

	payload, err := json.Marshal(request)
	if err != nil {
		return err
	}
	writer := bufio.NewWriter(s)
	writer.Write(payload)
	writer.WriteString("\n")
	writer.Flush()
	s.CloseWrite()
	return nil
}
