/*
Configuration module for StorageNode
Reads configuration from environment variables with sensible defaults.

Environment Variables:
  - DSN_PORT: P2P listening port (default: "11111")
  - DSN_NAMESPACE: Custom DHT namespace (default: "dsn")
  - DSN_BOOTSTRAP_PEERS: Comma-separated list of bootstrap multiaddrs
  - DSN_DATA_DIR: Directory for data storage (default: ".")
  - DSN_ANNOUNCE_ADDRESSES: Comma-separated external addresses to announce (optional)
*/
package config

import (
	"os"
	"strings"
)

// Config holds all configuration values for the node
type Config struct {
	Port              string   // P2P listening port
	Namespace         string   // DHT namespace
	BootstrapPeers    []string // List of bootstrap peer multiaddrs
	DataDir           string   // Directory for ID.json, Bootstrap.txt, and data
	AnnounceAddresses []string // External addresses to announce (for Docker/NAT)
}

// Default configuration values
const (
	DefaultPort      = "11111"
	DefaultNamespace = "dsn"
	DefaultDataDir   = "."
)

// Global configuration instance
var cfg *Config

// Load reads configuration from environment variables
func Load() *Config {
	if cfg != nil {
		return cfg
	}

	cfg = &Config{
		Port:              getEnvOrDefault("DSN_PORT", DefaultPort),
		Namespace:         getEnvOrDefault("DSN_NAMESPACE", DefaultNamespace),
		BootstrapPeers:    parseCommaSeparated(os.Getenv("DSN_BOOTSTRAP_PEERS")),
		DataDir:           getEnvOrDefault("DSN_DATA_DIR", DefaultDataDir),
		AnnounceAddresses: parseCommaSeparated(os.Getenv("DSN_ANNOUNCE_ADDRESSES")),
	}

	return cfg
}

// Get returns the current configuration, loading it if necessary
func Get() *Config {
	if cfg == nil {
		return Load()
	}
	return cfg
}

// getEnvOrDefault returns the environment variable value or a default
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// parseCommaSeparated splits a comma-separated string into a slice
// Returns empty slice if input is empty
func parseCommaSeparated(s string) []string {
	if s == "" {
		return []string{}
	}

	parts := strings.Split(s, ",")
	result := make([]string, 0, len(parts))

	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}

	return result
}

// IDFilePath returns the full path to the ID.json file
func (c *Config) IDFilePath() string {
	return c.DataDir + "/ID.json"
}

// BootstrapFilePath returns the full path to the Bootstrap.txt file
func (c *Config) BootstrapFilePath() string {
	return c.DataDir + "/Bootstrap.txt"
}

// HasBootstrapPeers returns true if bootstrap peers are configured
func (c *Config) HasBootstrapPeers() bool {
	return len(c.BootstrapPeers) > 0
}

// HasAnnounceAddresses returns true if announce addresses are configured
func (c *Config) HasAnnounceAddresses() bool {
	return len(c.AnnounceAddresses) > 0
}
