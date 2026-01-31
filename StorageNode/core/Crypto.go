package core

import (
	"fmt"

	"github.com/hashicorp/vault/shamir"
	"github.com/ipfs/go-cid"
	"github.com/multiformats/go-multihash"
)

func SplitKey(secret []byte, nShares int, threshold int) [][]byte {
	// --- Splitting the secret ---

	shares, err := shamir.Split(secret, nShares, threshold)
	if err != nil {
		fmt.Println("Error splitting secret:", err)
	}
	return shares

}

func ReconstructKey(shares [][]byte) string {

	reconstructedSecret, err := shamir.Combine(shares)
	if err != nil {
		fmt.Printf("Error combining shares: %v", err)
	}

	return string(reconstructedSecret)

}

func CidHash(key []byte) cid.Cid {
	mh, _ := multihash.Sum(key, multihash.SHA2_256, -1)
	c := cid.NewCidV1(cid.Raw, mh)
	return c
}
