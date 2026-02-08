/*
By Santiago Delgado, February 2026

PeerDiscovery.go

This file implements automatic peer discovery using DHT random walks
and connection health monitoring with automatic reconnection.

Task 1: Implement automatic peer discovery using DHT random walks
Task 2: Add connection health monitoring with automatic reconnection
*/

package core

import (
	"context"
	"crypto/rand"
	"fmt"
	"sync"
	"time"

	dht "github.com/libp2p/go-libp2p-kad-dht"
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/multiformats/go-multiaddr"
)

// PeerManager handles peer discovery and connection health monitoring
type PeerManager struct {
	host           host.Host
	dht            *dht.IpfsDHT
	ctx            context.Context
	cancel         context.CancelFunc
	bootstrapPeers []string

	// Connection health tracking
	peerHealth     map[peer.ID]*PeerHealthInfo
	healthMu       sync.RWMutex

	// Configuration
	discoveryInterval     time.Duration
	healthCheckInterval   time.Duration
	reconnectInterval     time.Duration
	maxReconnectAttempts  int
	minConnections        int
}

// PeerHealthInfo tracks the health status of a peer connection
type PeerHealthInfo struct {
	PeerID            peer.ID
	LastSeen          time.Time
	LastConnectTime   time.Time
	ConnectAttempts   int
	FailedAttempts    int
	IsConnected       bool
	ConnectionQuality ConnectionQuality
}

// ConnectionQuality represents the quality of a peer connection
type ConnectionQuality int

const (
	QualityUnknown ConnectionQuality = iota
	QualityPoor
	QualityFair
	QualityGood
	QualityExcellent
)

// Default configuration values
const (
	DefaultDiscoveryInterval    = 30 * time.Second
	DefaultHealthCheckInterval  = 10 * time.Second
	DefaultReconnectInterval    = 5 * time.Second
	DefaultMaxReconnectAttempts = 5
	DefaultMinConnections       = 3
)

// NewPeerManager creates a new peer manager instance
func NewPeerManager(h host.Host, kadDHT *dht.IpfsDHT, bootstrapPeers []string) *PeerManager {
	ctx, cancel := context.WithCancel(context.Background())

	pm := &PeerManager{
		host:                  h,
		dht:                   kadDHT,
		ctx:                   ctx,
		cancel:                cancel,
		bootstrapPeers:        bootstrapPeers,
		peerHealth:            make(map[peer.ID]*PeerHealthInfo),
		discoveryInterval:     DefaultDiscoveryInterval,
		healthCheckInterval:   DefaultHealthCheckInterval,
		reconnectInterval:     DefaultReconnectInterval,
		maxReconnectAttempts:  DefaultMaxReconnectAttempts,
		minConnections:        DefaultMinConnections,
	}

	// Set up connection notifier to track peer connections/disconnections
	h.Network().Notify(&network.NotifyBundle{
		ConnectedF:    pm.onPeerConnected,
		DisconnectedF: pm.onPeerDisconnected,
	})

	return pm
}

// Start begins the peer discovery and health monitoring loops
func (pm *PeerManager) Start() {
	fmt.Println("🔍 Starting Peer Manager...")

	// Start DHT bootstrap
	go pm.bootstrapDHT()

	// Start peer discovery loop (random walks)
	go pm.discoveryLoop()

	// Start connection health monitoring loop
	go pm.healthMonitorLoop()

	// Start reconnection loop for lost peers
	go pm.reconnectionLoop()

	fmt.Println("✅ Peer Manager started")
}

// Stop gracefully shuts down the peer manager
func (pm *PeerManager) Stop() {
	fmt.Println("⛔ Stopping Peer Manager...")
	pm.cancel()
}

// bootstrapDHT performs initial DHT bootstrap
func (pm *PeerManager) bootstrapDHT() {
	fmt.Println("📋 Bootstrapping DHT...")

	if err := pm.dht.Bootstrap(pm.ctx); err != nil {
		fmt.Printf("⚠️  DHT bootstrap error: %v\n", err)
		return
	}

	// Wait for bootstrap to complete
	time.Sleep(5 * time.Second)

	// Refresh the routing table
	<-pm.dht.RefreshRoutingTable()

	fmt.Printf("✅ DHT bootstrapped. Routing table size: %d\n", pm.dht.RoutingTable().Size())
}

// discoveryLoop periodically discovers new peers using DHT random walks
func (pm *PeerManager) discoveryLoop() {
	ticker := time.NewTicker(pm.discoveryInterval)
	defer ticker.Stop()

	// Do an initial discovery after a short delay
	time.Sleep(10 * time.Second)
	pm.discoverPeers()

	for {
		select {
		case <-pm.ctx.Done():
			fmt.Println("⛔ Peer discovery loop stopped")
			return
		case <-ticker.C:
			pm.discoverPeers()
		}
	}
}

// discoverPeers performs DHT random walks to discover new peers
func (pm *PeerManager) discoverPeers() {
	currentConns := len(pm.host.Network().Conns())
	fmt.Printf("🔍 Discovering peers... (current connections: %d)\n", currentConns)

	// Method 1: Refresh the routing table (triggers DHT walks)
	<-pm.dht.RefreshRoutingTable()

	// Method 2: Random walk - query DHT for random peer IDs
	for i := 0; i < 3; i++ {
		randomPeerID := pm.generateRandomPeerID()
		if randomPeerID == "" {
			continue
		}

		// Use a short timeout for random walks
		ctx, cancel := context.WithTimeout(pm.ctx, 10*time.Second)

		// FindPeer triggers a DHT lookup which discovers peers along the way
		_, err := pm.dht.FindPeer(ctx, peer.ID(randomPeerID))
		cancel()

		// We don't care if we find the random peer - the point is to discover
		// other peers during the search
		if err != nil && err.Error() != "routing: not found" {
			// Only log unexpected errors
			_ = err // Suppress unused variable warning
		}
	}

	// Method 3: Get closest peers to random keys
	pm.walkToRandomKey()

	// Report discovery results
	newConns := len(pm.host.Network().Conns())
	routingTableSize := pm.dht.RoutingTable().Size()
	fmt.Printf("📊 Discovery complete. Connections: %d → %d, Routing table: %d peers\n",
		currentConns, newConns, routingTableSize)
}

// generateRandomPeerID generates a random peer ID for DHT queries
func (pm *PeerManager) generateRandomPeerID() peer.ID {
	// Generate 32 random bytes
	randomBytes := make([]byte, 32)
	if _, err := rand.Read(randomBytes); err != nil {
		return ""
	}

	// Create a peer ID from the random bytes (this won't be a real peer)
	// but searching for it will help discover real peers
	return peer.ID(randomBytes)
}

// walkToRandomKey performs a DHT walk to a random key
func (pm *PeerManager) walkToRandomKey() {
	// Generate random key
	randomKey := make([]byte, 32)
	if _, err := rand.Read(randomKey); err != nil {
		return
	}

	ctx, cancel := context.WithTimeout(pm.ctx, 15*time.Second)
	defer cancel()

	// GetClosestPeers walks the DHT to find peers closest to a key
	closestPeers, err := pm.dht.GetClosestPeers(ctx, string(randomKey))
	if err != nil {
		return
	}

	// Process discovered peers
	discoveredCount := len(closestPeers)
	for _, discoveredPeerID := range closestPeers {
		// Try to connect to newly discovered peers
		if pm.host.Network().Connectedness(discoveredPeerID) != network.Connected {
			go pm.tryConnectPeer(discoveredPeerID)
		}
	}

	if discoveredCount > 0 {
		fmt.Printf("🔗 Random walk discovered %d peers\n", discoveredCount)
	}
}

// tryConnectPeer attempts to connect to a peer
func (pm *PeerManager) tryConnectPeer(peerID peer.ID) {
	// Skip if already connected
	if pm.host.Network().Connectedness(peerID) == network.Connected {
		return
	}

	// Get peer addresses from peerstore
	addrs := pm.host.Peerstore().Addrs(peerID)
	if len(addrs) == 0 {
		return
	}

	ctx, cancel := context.WithTimeout(pm.ctx, 10*time.Second)
	defer cancel()

	addrInfo := peer.AddrInfo{
		ID:    peerID,
		Addrs: addrs,
	}

	if err := pm.host.Connect(ctx, addrInfo); err != nil {
		pm.recordFailedConnection(peerID)
	}
}

// healthMonitorLoop periodically checks the health of peer connections
func (pm *PeerManager) healthMonitorLoop() {
	ticker := time.NewTicker(pm.healthCheckInterval)
	defer ticker.Stop()

	for {
		select {
		case <-pm.ctx.Done():
			fmt.Println("⛔ Health monitor loop stopped")
			return
		case <-ticker.C:
			pm.checkConnectionHealth()
		}
	}
}

// checkConnectionHealth checks and updates the health status of all connections
func (pm *PeerManager) checkConnectionHealth() {
	conns := pm.host.Network().Conns()

	pm.healthMu.Lock()
	defer pm.healthMu.Unlock()

	// Update connected peers
	connectedPeers := make(map[peer.ID]bool)
	for _, conn := range conns {
		peerID := conn.RemotePeer()
		connectedPeers[peerID] = true

		if health, exists := pm.peerHealth[peerID]; exists {
			health.LastSeen = time.Now()
			health.IsConnected = true
			health.FailedAttempts = 0 // Reset failed attempts on successful connection

			// Update connection quality based on connection stats
			health.ConnectionQuality = pm.assessConnectionQuality(conn)
		} else {
			// New peer
			pm.peerHealth[peerID] = &PeerHealthInfo{
				PeerID:            peerID,
				LastSeen:          time.Now(),
				LastConnectTime:   time.Now(),
				IsConnected:       true,
				ConnectionQuality: QualityGood,
			}
		}
	}

	// Mark disconnected peers
	for peerID, health := range pm.peerHealth {
		if !connectedPeers[peerID] && health.IsConnected {
			health.IsConnected = false
			fmt.Printf("⚠️  Peer disconnected: %s\n", peerID.String()[:12])
		}
	}
}

// assessConnectionQuality evaluates the quality of a connection
func (pm *PeerManager) assessConnectionQuality(conn network.Conn) ConnectionQuality {
	// Get connection statistics
	stat := conn.Stat()

	// Assess based on connection duration and number of streams
	duration := time.Since(stat.Opened)

	if duration > 1*time.Hour {
		return QualityExcellent
	} else if duration > 10*time.Minute {
		return QualityGood
	} else if duration > 1*time.Minute {
		return QualityFair
	}

	return QualityUnknown
}

// reconnectionLoop attempts to reconnect to lost peers
func (pm *PeerManager) reconnectionLoop() {
	ticker := time.NewTicker(pm.reconnectInterval)
	defer ticker.Stop()

	for {
		select {
		case <-pm.ctx.Done():
			fmt.Println("⛔ Reconnection loop stopped")
			return
		case <-ticker.C:
			pm.attemptReconnections()
		}
	}
}

// attemptReconnections tries to reconnect to disconnected peers
func (pm *PeerManager) attemptReconnections() {
	currentConns := len(pm.host.Network().Conns())

	// Only attempt reconnections if below minimum connections
	if currentConns >= pm.minConnections {
		return
	}

	pm.healthMu.RLock()
	var peersToReconnect []peer.ID

	for peerID, health := range pm.peerHealth {
		if !health.IsConnected &&
			health.FailedAttempts < pm.maxReconnectAttempts &&
			time.Since(health.LastSeen) < 30*time.Minute {
			peersToReconnect = append(peersToReconnect, peerID)
		}
	}
	pm.healthMu.RUnlock()

	// Also add bootstrap peers if we're low on connections
	if currentConns < pm.minConnections {
		for _, addrStr := range pm.bootstrapPeers {
			ma, err := multiaddr.NewMultiaddr(addrStr)
			if err != nil {
				continue
			}

			pi, err := peer.AddrInfoFromP2pAddr(ma)
			if err != nil {
				continue
			}

			// Skip if already connected
			if pm.host.Network().Connectedness(pi.ID) != network.Connected {
				peersToReconnect = append(peersToReconnect, pi.ID)
			}
		}
	}

	// Attempt reconnections
	for _, peerID := range peersToReconnect {
		go pm.reconnectToPeer(peerID)
	}
}

// reconnectToPeer attempts to reconnect to a specific peer
func (pm *PeerManager) reconnectToPeer(peerID peer.ID) {
	// Skip if already connected
	if pm.host.Network().Connectedness(peerID) == network.Connected {
		return
	}

	// Get peer addresses
	addrs := pm.host.Peerstore().Addrs(peerID)

	// Also check bootstrap peers for addresses
	for _, addrStr := range pm.bootstrapPeers {
		ma, err := multiaddr.NewMultiaddr(addrStr)
		if err != nil {
			continue
		}

		pi, err := peer.AddrInfoFromP2pAddr(ma)
		if err != nil {
			continue
		}

		if pi.ID == peerID {
			addrs = append(addrs, pi.Addrs...)
		}
	}

	if len(addrs) == 0 {
		return
	}

	ctx, cancel := context.WithTimeout(pm.ctx, 15*time.Second)
	defer cancel()

	addrInfo := peer.AddrInfo{
		ID:    peerID,
		Addrs: addrs,
	}

	fmt.Printf("🔄 Attempting to reconnect to peer: %s\n", peerID.String()[:12])

	if err := pm.host.Connect(ctx, addrInfo); err != nil {
		pm.recordFailedConnection(peerID)
		fmt.Printf("❌ Failed to reconnect to %s: %v\n", peerID.String()[:12], err)
	} else {
		fmt.Printf("✅ Reconnected to peer: %s\n", peerID.String()[:12])
	}
}

// recordFailedConnection records a failed connection attempt
func (pm *PeerManager) recordFailedConnection(peerID peer.ID) {
	pm.healthMu.Lock()
	defer pm.healthMu.Unlock()

	if health, exists := pm.peerHealth[peerID]; exists {
		health.FailedAttempts++
		health.ConnectAttempts++
	} else {
		pm.peerHealth[peerID] = &PeerHealthInfo{
			PeerID:          peerID,
			FailedAttempts:  1,
			ConnectAttempts: 1,
		}
	}
}

// onPeerConnected is called when a peer connects
func (pm *PeerManager) onPeerConnected(n network.Network, conn network.Conn) {
	peerID := conn.RemotePeer()

	pm.healthMu.Lock()
	defer pm.healthMu.Unlock()

	if health, exists := pm.peerHealth[peerID]; exists {
		health.IsConnected = true
		health.LastConnectTime = time.Now()
		health.LastSeen = time.Now()
		health.FailedAttempts = 0
	} else {
		pm.peerHealth[peerID] = &PeerHealthInfo{
			PeerID:            peerID,
			IsConnected:       true,
			LastConnectTime:   time.Now(),
			LastSeen:          time.Now(),
			ConnectionQuality: QualityGood,
		}
	}

	fmt.Printf("🔗 Peer connected: %s (total: %d)\n", peerID.String()[:12], len(n.Conns()))
}

// onPeerDisconnected is called when a peer disconnects
func (pm *PeerManager) onPeerDisconnected(n network.Network, conn network.Conn) {
	peerID := conn.RemotePeer()

	pm.healthMu.Lock()
	defer pm.healthMu.Unlock()

	if health, exists := pm.peerHealth[peerID]; exists {
		health.IsConnected = false
	}

	fmt.Printf("🔌 Peer disconnected: %s (remaining: %d)\n", peerID.String()[:12], len(n.Conns()))
}

// GetConnectedPeers returns a list of currently connected peers
func (pm *PeerManager) GetConnectedPeers() []peer.ID {
	conns := pm.host.Network().Conns()
	peers := make([]peer.ID, len(conns))

	for i, conn := range conns {
		peers[i] = conn.RemotePeer()
	}

	return peers
}

// GetPeerHealth returns health information for a specific peer
func (pm *PeerManager) GetPeerHealth(peerID peer.ID) *PeerHealthInfo {
	pm.healthMu.RLock()
	defer pm.healthMu.RUnlock()

	if health, exists := pm.peerHealth[peerID]; exists {
		// Return a copy to avoid race conditions
		healthCopy := *health
		return &healthCopy
	}

	return nil
}

// GetNetworkStats returns overall network statistics
func (pm *PeerManager) GetNetworkStats() NetworkStats {
	pm.healthMu.RLock()
	defer pm.healthMu.RUnlock()

	stats := NetworkStats{
		TotalConnections:   len(pm.host.Network().Conns()),
		RoutingTableSize:   pm.dht.RoutingTable().Size(),
		KnownPeers:         len(pm.peerHealth),
		ConnectedPeers:     0,
		DisconnectedPeers:  0,
		HealthyConnections: 0,
	}

	for _, health := range pm.peerHealth {
		if health.IsConnected {
			stats.ConnectedPeers++
			if health.ConnectionQuality >= QualityFair {
				stats.HealthyConnections++
			}
		} else {
			stats.DisconnectedPeers++
		}
	}

	return stats
}

// NetworkStats holds overall network statistics
type NetworkStats struct {
	TotalConnections   int
	RoutingTableSize   int
	KnownPeers         int
	ConnectedPeers     int
	DisconnectedPeers  int
	HealthyConnections int
}

// String returns a formatted string of network stats
func (ns NetworkStats) String() string {
	return fmt.Sprintf(
		"Connections: %d | Routing Table: %d | Known Peers: %d | Connected: %d | Healthy: %d",
		ns.TotalConnections,
		ns.RoutingTableSize,
		ns.KnownPeers,
		ns.ConnectedPeers,
		ns.HealthyConnections,
	)
}
