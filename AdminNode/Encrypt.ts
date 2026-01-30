// Convert code from go to typescript

// #------------------------------------------------------------------------------------------------#
// Encrypt (Go code to convert to TypeScript)
// #------------------------------------------------------------------------------------------------#

// EncryptUserData.go


/*package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io"
)

// Pipe line:
// User sends the Admin the data via tls

// Takes takes the users data 2cFkC6fVoMNfmFogGK5xKGnnhKD8nQlrScNfE8/r6qc6kcNyVt2Ynw==in this case as a string

// encryptData takes plaintext input and a symmetric key, then returns ciphertext.
func encryptData(plaintext string, key []byte) (string, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	// GCM mode adds authentication (integrity check)
	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	// Random nonce (IV) per encryption
	nonce := make([]byte, aesGCM.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	// Encrypt and authenticate
	ciphertext := aesGCM.Seal(nonce, nonce, []byte(plaintext), nil)

	// Return base64 string (easier to print or send)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func main() {
	// Example 32-byte key for AES-256
	key := []byte("12345678901234567890123456789012")

	var input string
	fmt.Print("This is the data the User sends the Admin: ")
	fmt.Scanln(&input)

	encrypted, err := encryptData(input, key)
	if err != nil {
		panic(err)
	}

	fmt.Println("Encrypted output:", encrypted)
}
*/


// Working base ???
// import crypto from 'crypto';

// // encryptData takes plaintext input and a symmetric key, then returns ciphertext.
// function encryptData(plaintext: string, key: Buffer): string {
//     const block = crypto.createCipheriv('aes-256-gcm', key, crypto.randomBytes(12));
    
//     // Encrypt and authenticate
//     let ciphertext = block.update(plaintext, 'utf8', 'base64');
//     ciphertext += block.final('base64');

//     // Return base64 string (easier to print or send)
//     return ciphertext;
// }

// // Example usage
// const key = Buffer.from('12345678901234567890123456789012'); // 32-byte key for AES-256
// const input = 'This is the data the User sends the Admin';

// const encrypted = encryptData(input, key);
// console.log('Encrypted output:', encrypted);


import crypto from "crypto";

function encryptData(plaintext: string, key: Buffer): string {
    // AES-GCM needs a 12-byte nonce
    const nonce = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv("aes-256-gcm", key, nonce);

    const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    // Match Go's: nonce || ciphertext || tag
    const output = Buffer.concat([nonce, encrypted, authTag]);

    return output.toString("base64");
}

// Example usage:
// const key = Buffer.from("12345678901234567890123456789012"); 

// const input = "Hello Admin";
// const encrypted = encryptData(input, key);

// console.log("Encrypted output:", encrypted);

// #------------------------------------------------------------------------------------------------#

