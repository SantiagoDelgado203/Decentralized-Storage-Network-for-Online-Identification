/*
Initialization module for StorageNode
Handles first-time setup including identity generation.

By Santiago Delgado, December 2025
Updated: January 2026
*/
package exec

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"node/config"

	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/libp2p/go-libp2p/core/peer"
)

// IdentityKeys represents the JSON structure for storing keys
type IdentityKeys struct {
	PrivateKey string `json:"private_key"`
	PublicKey  string `json:"public_key"`
}

// Init performs one-time initialization for the node
// - Creates data directory if needed
// - Generates identity (keypair) if ID.json doesn't exist
// - Creates empty Bootstrap.txt if it doesn't exist
func Init() error {
	cfg := config.Load()

	fmt.Println("🔧 Initializing StorageNode...")
	fmt.Printf("   Data directory: %s\n", cfg.DataDir)

	// Create data directory if it doesn't exist
	if err := ensureDataDir(cfg.DataDir); err != nil {
		return fmt.Errorf("failed to create data directory: %w", err)
	}

	// Generate identity if needed
	if err := ensureIdentity(cfg); err != nil {
		return fmt.Errorf("failed to initialize identity: %w", err)
	}

	// Create Bootstrap.txt if needed
	if err := ensureBootstrapFile(cfg); err != nil {
		return fmt.Errorf("failed to initialize bootstrap file: %w", err)
	}

	fmt.Println("✅ Initialization complete!")
	return nil
}

// ensureDataDir creates the data directory if it doesn't exist
func ensureDataDir(dir string) error {
	if dir == "." {
		return nil // Current directory always exists
	}

	if _, err := os.Stat(dir); os.IsNotExist(err) {
		fmt.Printf("   Creating data directory: %s\n", dir)
		return os.MkdirAll(dir, 0755)
	}
	return nil
}

// ensureIdentity generates a new identity if ID.json doesn't exist
func ensureIdentity(cfg *config.Config) error {
	idPath := cfg.IDFilePath()

	// Check if identity already exists
	if _, err := os.Stat(idPath); err == nil {
		// File exists, read and display peer ID
		peerID, err := getPeerIDFromFile(idPath)
		if err != nil {
			return fmt.Errorf("identity file exists but is invalid: %w", err)
		}
		fmt.Printf("   ✓ Identity exists: %s\n", peerID)
		return nil
	}

	fmt.Println("   Generating new identity...")

	// Generate new RSA keypair (2048 bits for compatibility)
	priv, pub, err := crypto.GenerateKeyPairWithReader(crypto.RSA, 2048, rand.Reader)
	if err != nil {
		return fmt.Errorf("failed to generate keypair: %w", err)
	}

	// Marshal keys to bytes
	privBytes, err := crypto.MarshalPrivateKey(priv)
	if err != nil {
		return fmt.Errorf("failed to marshal private key: %w", err)
	}

	pubBytes, err := crypto.MarshalPublicKey(pub)
	if err != nil {
		return fmt.Errorf("failed to marshal public key: %w", err)
	}

	// Create identity structure
	identity := IdentityKeys{
		PrivateKey: base64.StdEncoding.EncodeToString(privBytes),
		PublicKey:  base64.StdEncoding.EncodeToString(pubBytes),
	}

	// Write to file
	data, err := json.MarshalIndent(identity, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal identity JSON: %w", err)
	}

	if err := os.WriteFile(idPath, data, 0600); err != nil {
		return fmt.Errorf("failed to write identity file: %w", err)
	}

	// Get and display the peer ID
	peerID, err := peer.IDFromPublicKey(pub)
	if err != nil {
		return fmt.Errorf("failed to derive peer ID: %w", err)
	}

	fmt.Printf("   ✓ Generated new identity!\n")
	fmt.Printf("   📋 Peer ID: %s\n", peerID.String())
	fmt.Printf("   📁 Saved to: %s\n", idPath)

	return nil
}

// ensureBootstrapFile creates an empty Bootstrap.txt if it doesn't exist
func ensureBootstrapFile(cfg *config.Config) error {
	bootstrapPath := cfg.BootstrapFilePath()

	if _, err := os.Stat(bootstrapPath); err == nil {
		fmt.Printf("   ✓ Bootstrap file exists: %s\n", bootstrapPath)
		return nil
	}

	// Ensure parent directory exists
	dir := filepath.Dir(bootstrapPath)
	if dir != "." {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return err
		}
	}

	// Create empty file
	if err := os.WriteFile(bootstrapPath, []byte(""), 0644); err != nil {
		return fmt.Errorf("failed to create bootstrap file: %w", err)
	}

	fmt.Printf("   ✓ Created bootstrap file: %s\n", bootstrapPath)
	return nil
}

// getPeerIDFromFile reads an identity file and returns the peer ID
func getPeerIDFromFile(path string) (string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}

	var keys IdentityKeys
	if err := json.Unmarshal(data, &keys); err != nil {
		return "", err
	}

	pubBytes, err := base64.StdEncoding.DecodeString(keys.PublicKey)
	if err != nil {
		return "", err
	}

	pub, err := crypto.UnmarshalPublicKey(pubBytes)
	if err != nil {
		return "", err
	}

	peerID, err := peer.IDFromPublicKey(pub)
	if err != nil {
		return "", err
	}

	return peerID.String(), nil
}
