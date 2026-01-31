// package main

// import (
// 	"crypto/aes"      //AES encryption
// 	"crypto/cipher"   //cipher package for encryption modes
// 	"encoding/base64" //base64 encoding/decoding
// 	"fmt"             //formatting and printing
// 	"os"              //operating system functions
// )

// // decryptData takes the users decrypted data (string) and the symmetric key
// // Then returns the original plaintext

// func decryptData(encrypted string, key []byte) (string, error) {
// 	// Decode the base64 string
// 	ciphertext, err := base64.StdEncoding.DecodeString(encrypted)
// 	if err != nil {
// 		return "", err
// 	}

// 	block, err := aes.NewCipher(key)
// 	if err != nil {
// 		return "", err
// 	}

// 	aesGCM, err := cipher.NewGCM(block)
// 	if err != nil {
// 		return "", err
// 	}

// 	nonceSize := aesGCM.NonceSize()
// 	if len(ciphertext) < nonceSize {
// 		return "", fmt.Errorf("ciphertext too short")
// 	}

// 	nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]

// 	// Decrypt and verify authenticity
// 	plaintext, err := aesGCM.Open(nil, nonce, ciphertext, nil)
// 	if err != nil {
// 		return "", err
// 	}

// 	return string(plaintext), nil
// }

// func main() {
// 	key := []byte("12345678901234567890123456789012")

// 	// Accept encrypted input
// 	var encrypted string
// 	fmt.Print("Enter encrypted data to decrypt: ")
// 	fmt.Scanln(&encrypted)

// 	decrypted, err := decryptData(encrypted, key)
// 	if err != nil {
// 		fmt.Println("Decryption failed:", err)
// 		os.Exit(1)
// 	}

// 	fmt.Println("Decrypted output:", decrypted)
// }


import crypto from "crypto";

export default function decryptData(encryptedBase64: string, key: Buffer): string {
    const data = Buffer.from(encryptedBase64, "base64");

    const nonceSize = 12;  
    const tagSize = 16;     

    if (data.length < nonceSize + tagSize) {
        throw new Error("Ciphertext too short");
    }


    const nonce = data.subarray(0, nonceSize);
    const authTag = data.subarray(data.length - tagSize);
    const ciphertext = data.subarray(nonceSize, data.length - tagSize);

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, nonce);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final()
    ]);

    return decrypted.toString("utf8");
}

// Example usage:
// const key = Buffer.from("12345678901234567890123456789012");

// const encrypted = "PASTE_BASE64_STRING_HERE";

// try {
//     const result = decryptData(encrypted, key);
//     console.log("Decrypted output:", result);
// } catch (err) {
//     console.error("Decryption failed:", err);
// }
