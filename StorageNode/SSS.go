package main

import (
	"bufio"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// Updated Version of Symmetric encryption (Refer to Level1.go for the simple version)

func encrypt(key, plaintext []byte) (combined []byte, nonce []byte, ciphertext []byte) {
	block, _ := aes.NewCipher(key)
	nonce = make([]byte, 12)
	_, _ = rand.Read(nonce)

	aesgcm, _ := cipher.NewGCM(block)
	ciphertext = aesgcm.Seal(nil, nonce, plaintext, nil)

	// combined is nonce || ciphertext_with_tag
	combined = append(nonce, ciphertext...)
	return combined, nonce, ciphertext
}

// Galois Field
// Converts Bytes into a polynomial
// Which can then be used for multiplication
// Used in SSS

func gfMul(a, b byte) byte {
	var res byte = 0
	for b > 0 {
		if b&1 == 1 {
			res ^= a
		}
		if a&0x80 != 0 {
			a = (a << 1) ^ 0x1B
		} else {
			a <<= 1
		}
		b >>= 1
	}
	return res
}

// Galois Field
// Converts Bytes into a polynomial
// Which can then be used for exponents
// Used in SSS

func gfPow(a, n byte) byte {
	res := byte(1)
	for n > 0 {
		if n&1 == 1 {
			res = gfMul(res, a)
		}
		a = gfMul(a, a)
		n >>= 1
	}
	return res
}

// Takes our symmetric key
// Splits it into x shares
// (Look more into it)

func evalPoly(coeff []byte, x byte) byte {
	result := coeff[0]
	for i := 1; i < len(coeff); i++ {
		result ^= gfMul(coeff[i], gfPow(x, byte(i)))
	}
	return result
}

// SSS Split function pulled from stackoverflow
func shamirSplit(secret []byte, n, k int) [][]byte {
	shares := make([][]byte, n)
	for i := 0; i < n; i++ {
		shares[i] = make([]byte, len(secret)+1)
		shares[i][0] = byte(i + 1)
	}
	for b := 0; b < len(secret); b++ {
		coeff := make([]byte, k)
		coeff[0] = secret[b]
		_, _ = rand.Read(coeff[1:])
		for i := 0; i < n; i++ {
			x := byte(i + 1)
			shares[i][b+1] = evalPoly(coeff, x)
		}
	}
	return shares
}

// SSS Reassemble function pulled from stackoverflow
func shamirCombine(shares [][]byte) []byte {
	k := len(shares)
	length := len(shares[0]) - 1
	secret := make([]byte, length)
	for b := 0; b < length; b++ {
		var result byte = 0
		for i := 0; i < k; i++ {
			xi := shares[i][0]
			yi := shares[i][b+1]
			num := byte(1)
			den := byte(1)
			for j := 0; j < k; j++ {
				if i == j {
					continue
				}
				xj := shares[j][0]
				num = gfMul(num, xj)
				den = gfMul(den, xi^xj)
			}
			li := gfMul(num, gfPow(den, 254)) // inverse den^(255-1)=den^-1
			result ^= gfMul(yi, li)
		}
		secret[b] = result
	}
	return secret
}

// Run Program

func SSS() {
	reader := bufio.NewReader(os.Stdin)

	// Hardcoded AES-256 key
	key := []byte("12345678901234567890123456789012") //Hard coded to Decrypt with same key

	fmt.Print("Enter message to encrypt: ")
	userText, _ := reader.ReadString('\n')
	plaintext := []byte(userText)

	// Encrypt and produce combined (nonce + ciphertext+tag)
	combined, nonce, ciphertext := encrypt(key, plaintext)

	// Print base64 of the combined blob -> this is what file #2 expects
	cipherB64 := base64.StdEncoding.EncodeToString(combined)
	fmt.Println("\nCiphertext (base64 nonce||ciphertext):")
	fmt.Println(cipherB64)

	// Also print nonce & ciphertext separately for debugging (hex)
	fmt.Println("\nNonce (hex):", hex.EncodeToString(nonce))
	fmt.Println("Ciphertext (hex):", hex.EncodeToString(ciphertext))

	// ===== SSS: user chooses n and k =====
	fmt.Print("\nEnter total number of shares (n): ")
	nStr, _ := reader.ReadString('\n')
	nStr = strings.TrimSpace(nStr)
	n, err := strconv.Atoi(nStr)
	if err != nil || n < 1 {
		fmt.Println("Invalid number of shares, using default n=5")
		n = 5
	}

	fmt.Print("Enter threshold (k): ")
	kStr, _ := reader.ReadString('\n')
	kStr = strings.TrimSpace(kStr)
	k, err := strconv.Atoi(kStr)
	if err != nil || k < 1 || k > n {
		fmt.Println("Invalid threshold, using default k=3")
		k = 3
	}

	// SSS split the AES key
	shares := shamirSplit(key, n, k)

	fmt.Println("\nGenerated Shares (hex format, first byte = x):")
	for _, s := range shares {
		fmt.Printf("Share %d: %s\n", s[0], hex.EncodeToString(s[1:]))
	}

	// reconstruct using first k shares and verify decryption
	recoveredKey := shamirCombine(shares[:k])
	fmt.Println("\nRecovered Key (hex):", hex.EncodeToString(recoveredKey))
	fmt.Println("Recovered Key (as string):", string(recoveredKey))

	// Verify decryption using recovered key
	block, _ := aes.NewCipher(recoveredKey)
	aesgcm, _ := cipher.NewGCM(block)
	nonceSize := aesgcm.NonceSize()
	if len(combined) >= nonceSize {
		nonce2 := combined[:nonceSize]
		ct2 := combined[nonceSize:]
		plaintext2, err := aesgcm.Open(nil, nonce2, ct2, nil)
		if err == nil {
			fmt.Println("\n Decrypted via recovered key:")
			fmt.Println(string(plaintext2))
		} else {
			fmt.Println("\n Decrypt failed with recovered key:", err)
		}
	}
}

func main() {
	SSS()
}
