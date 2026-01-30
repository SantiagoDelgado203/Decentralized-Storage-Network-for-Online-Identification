package main

import (
	"bufio"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"os"
	"strings"
)

func main() {
	reader := bufio.NewReader(os.Stdin)

	fmt.Print("Enter data to hash: ")
	userInput, err := reader.ReadString('\n')
	if err != nil {
		fmt.Println("Error reading input:", err)
		return
	}

	// Remove trailing newline or carriage return
	userInput = strings.TrimSpace(userInput)

	// Convert string to bytes
	dataBytes := []byte(userInput)

	// Generate SHA-256 hash
	hash := sha256.Sum256(dataBytes)

	// Convert hash to hexadecimal string
	hashString := hex.EncodeToString(hash[:])

	fmt.Println("\nOriginal Data :", userInput)
	fmt.Println("SHA-256 Hash  :", hashString)
}
