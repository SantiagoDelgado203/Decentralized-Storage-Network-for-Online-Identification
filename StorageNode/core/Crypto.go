package core

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
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

/** helped function, only to be used in Encrypt function */
func generateKey() ([]byte, error) {
	key := make([]byte, 32)
	if _, err := rand.Read(key); err != nil {
		return nil, err
	}
	return key, nil
}

func Encrypt(plaintext []byte) ([]byte, []byte, error) {
	key, err := generateKey()
	if err != nil {
		return nil, nil, err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, nil, err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err = rand.Read(nonce); err != nil {
		return nil, nil, err
	}

	ciphertext := gcm.Seal(nonce, nonce, plaintext, nil)
	return ciphertext, key, nil
}

func Decrypt(key, ciphertext []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonceSize := gcm.NonceSize()
	if len(ciphertext) < nonceSize {
		return nil, fmt.Errorf("ciphertext too short")
	}

	nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]

	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return nil, err
	}

	return plaintext, nil
}
