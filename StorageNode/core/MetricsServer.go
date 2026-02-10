/*
By Santiago Delgado, February 2026

MetricsServer.go

HTTP server exposing network metrics including:
  - Peer count and connection states
  - Latency measurements to connected peers
  - Bandwidth statistics
  - Node health information
*/

package core

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/p2p/protocol/ping"
)

// MetricsServer provides HTTP endpoints for network metrics
type MetricsServer struct {
	host        host.Host
	peerManager *PeerManager
	server      *http.Server
	pingService *ping.PingService

	// Latency cache
	latencyCache   map[peer.ID]time.Duration
	latencyCacheMu sync.RWMutex
}

// PeerMetrics contains metrics for a single peer
type PeerMetrics struct {
	PeerID          string        `json:"peer_id"`
	ShortID         string        `json:"short_id"`
	Addresses       []string      `json:"addresses"`
	ConnectionState string        `json:"connection_state"`
	Direction       string        `json:"direction"`
	Latency         string        `json:"latency,omitempty"`
	LatencyMs       float64       `json:"latency_ms,omitempty"`
	ConnectedSince  string        `json:"connected_since,omitempty"`
	NumStreams      int           `json:"num_streams"`
}

// NetworkMetrics contains overall network metrics
type NetworkMetrics struct {
	NodeID           string         `json:"node_id"`
	Timestamp        string         `json:"timestamp"`
	Uptime           string         `json:"uptime"`
	
	// Connection counts
	TotalConnections int            `json:"total_connections"`
	InboundConns     int            `json:"inbound_connections"`
	OutboundConns    int            `json:"outbound_connections"`
	
	// Peer information
	ConnectedPeers   int            `json:"connected_peers"`
	KnownPeers       int            `json:"known_peers"`
	
	// DHT stats
	RoutingTableSize int            `json:"routing_table_size"`
	
	// Health
	HealthyConns     int            `json:"healthy_connections"`
	
	// Bandwidth (bytes)
	BandwidthIn      int64          `json:"bandwidth_in_bytes"`
	BandwidthOut     int64          `json:"bandwidth_out_bytes"`
	
	// Latency stats
	AvgLatencyMs     float64        `json:"avg_latency_ms"`
	MinLatencyMs     float64        `json:"min_latency_ms"`
	MaxLatencyMs     float64        `json:"max_latency_ms"`
	
	// Per-peer details
	Peers            []PeerMetrics  `json:"peers"`
}

// ConnectionStateMetrics provides a breakdown of connection states
type ConnectionStateMetrics struct {
	Connected    int `json:"connected"`
	CanConnect   int `json:"can_connect"`
	CannotConnect int `json:"cannot_connect"`
	Unknown      int `json:"unknown"`
}

// HealthResponse for the health endpoint
type HealthResponse struct {
	Status    string `json:"status"`
	NodeID    string `json:"node_id"`
	Peers     int    `json:"peers"`
	Timestamp string `json:"timestamp"`
}

var startTime = time.Now()

// NewMetricsServer creates a new metrics server
func NewMetricsServer(h host.Host, pm *PeerManager, port string) *MetricsServer {
	ms := &MetricsServer{
		host:         h,
		peerManager:  pm,
		pingService:  ping.NewPingService(h),
		latencyCache: make(map[peer.ID]time.Duration),
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/health", ms.handleHealth)
	mux.HandleFunc("/metrics", ms.handleMetrics)
	mux.HandleFunc("/metrics/peers", ms.handlePeers)
	mux.HandleFunc("/metrics/latency", ms.handleLatency)
	mux.HandleFunc("/metrics/connections", ms.handleConnections)

	ms.server = &http.Server{
		Addr:         ":" + port,
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return ms
}

// Start begins the metrics server
func (ms *MetricsServer) Start() error {
	fmt.Printf("📊 Metrics server starting on port %s\n", ms.server.Addr)
	
	// Start background latency measurement
	go ms.measureLatencyLoop()
	
	go func() {
		if err := ms.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			fmt.Printf("⚠️  Metrics server error: %v\n", err)
		}
	}()
	
	return nil
}

// Stop gracefully shuts down the metrics server
func (ms *MetricsServer) Stop() error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return ms.server.Shutdown(ctx)
}

// handleHealth returns basic health status
func (ms *MetricsServer) handleHealth(w http.ResponseWriter, r *http.Request) {
	response := HealthResponse{
		Status:    "healthy",
		NodeID:    ms.host.ID().String(),
		Peers:     len(ms.host.Network().Peers()),
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}
	
	ms.writeJSON(w, response)
}

// handleMetrics returns comprehensive network metrics
func (ms *MetricsServer) handleMetrics(w http.ResponseWriter, r *http.Request) {
	conns := ms.host.Network().Conns()
	
	// Count inbound/outbound
	inbound := 0
	outbound := 0
	for _, conn := range conns {
		if conn.Stat().Direction == network.DirInbound {
			inbound++
		} else {
			outbound++
		}
	}
	
	// Get peer manager stats
	pmStats := ms.peerManager.GetNetworkStats()
	
	// Build peer metrics
	peerMetrics := ms.buildPeerMetrics(conns)
	
	// Calculate latency stats
	avgLatency, minLatency, maxLatency := ms.calculateLatencyStats()
	
	metrics := NetworkMetrics{
		NodeID:           ms.host.ID().String(),
		Timestamp:        time.Now().UTC().Format(time.RFC3339),
		Uptime:           time.Since(startTime).Round(time.Second).String(),
		TotalConnections: len(conns),
		InboundConns:     inbound,
		OutboundConns:    outbound,
		ConnectedPeers:   pmStats.ConnectedPeers,
		KnownPeers:       pmStats.KnownPeers,
		RoutingTableSize: pmStats.RoutingTableSize,
		HealthyConns:     pmStats.HealthyConnections,
		BandwidthIn:      0, // Would need bandwidth counter
		BandwidthOut:     0,
		AvgLatencyMs:     avgLatency,
		MinLatencyMs:     minLatency,
		MaxLatencyMs:     maxLatency,
		Peers:            peerMetrics,
	}
	
	ms.writeJSON(w, metrics)
}

// handlePeers returns detailed peer information
func (ms *MetricsServer) handlePeers(w http.ResponseWriter, r *http.Request) {
	conns := ms.host.Network().Conns()
	peerMetrics := ms.buildPeerMetrics(conns)
	
	response := map[string]interface{}{
		"timestamp":   time.Now().UTC().Format(time.RFC3339),
		"total_peers": len(peerMetrics),
		"peers":       peerMetrics,
	}
	
	ms.writeJSON(w, response)
}

// handleLatency returns latency measurements for all peers
func (ms *MetricsServer) handleLatency(w http.ResponseWriter, r *http.Request) {
	ms.latencyCacheMu.RLock()
	defer ms.latencyCacheMu.RUnlock()
	
	latencies := make(map[string]interface{})
	for peerID, latency := range ms.latencyCache {
		latencies[peerID.String()[:12]] = map[string]interface{}{
			"peer_id":    peerID.String(),
			"latency":    latency.String(),
			"latency_ms": float64(latency.Microseconds()) / 1000.0,
		}
	}
	
	avg, min, max := ms.calculateLatencyStats()
	
	response := map[string]interface{}{
		"timestamp":      time.Now().UTC().Format(time.RFC3339),
		"peer_count":     len(latencies),
		"avg_latency_ms": avg,
		"min_latency_ms": min,
		"max_latency_ms": max,
		"peers":          latencies,
	}
	
	ms.writeJSON(w, response)
}

// handleConnections returns connection state breakdown
func (ms *MetricsServer) handleConnections(w http.ResponseWriter, r *http.Request) {
	peers := ms.host.Peerstore().Peers()
	
	states := ConnectionStateMetrics{}
	
	for _, peerID := range peers {
		if peerID == ms.host.ID() {
			continue
		}
		
		switch ms.host.Network().Connectedness(peerID) {
		case network.Connected:
			states.Connected++
		case network.CanConnect:
			states.CanConnect++
		case network.CannotConnect:
			states.CannotConnect++
		default:
			states.Unknown++
		}
	}
	
	response := map[string]interface{}{
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"states":    states,
		"total":     states.Connected + states.CanConnect + states.CannotConnect + states.Unknown,
	}
	
	ms.writeJSON(w, response)
}

// buildPeerMetrics constructs metrics for each connected peer
func (ms *MetricsServer) buildPeerMetrics(conns []network.Conn) []PeerMetrics {
	metrics := make([]PeerMetrics, 0, len(conns))
	
	ms.latencyCacheMu.RLock()
	defer ms.latencyCacheMu.RUnlock()
	
	for _, conn := range conns {
		peerID := conn.RemotePeer()
		stat := conn.Stat()
		
		// Get addresses
		addrs := make([]string, 0)
		addrs = append(addrs, conn.RemoteMultiaddr().String())
		
		// Direction
		direction := "outbound"
		if stat.Direction == network.DirInbound {
			direction = "inbound"
		}
		
		// Latency
		latencyStr := ""
		latencyMs := 0.0
		if lat, ok := ms.latencyCache[peerID]; ok {
			latencyStr = lat.String()
			latencyMs = float64(lat.Microseconds()) / 1000.0
		}
		
		// Stream count
		numStreams := len(conn.GetStreams())
		
		pm := PeerMetrics{
			PeerID:          peerID.String(),
			ShortID:         peerID.String()[:12],
			Addresses:       addrs,
			ConnectionState: "connected",
			Direction:       direction,
			Latency:         latencyStr,
			LatencyMs:       latencyMs,
			ConnectedSince:  stat.Opened.Format(time.RFC3339),
			NumStreams:      numStreams,
		}
		
		metrics = append(metrics, pm)
	}
	
	return metrics
}

// measureLatencyLoop periodically measures latency to all peers
func (ms *MetricsServer) measureLatencyLoop() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()
	
	// Initial measurement after startup
	time.Sleep(10 * time.Second)
	ms.measureAllLatencies()
	
	for range ticker.C {
		ms.measureAllLatencies()
	}
}

// measureAllLatencies pings all connected peers and updates cache
func (ms *MetricsServer) measureAllLatencies() {
	peers := ms.host.Network().Peers()
	
	for _, peerID := range peers {
		go ms.measurePeerLatency(peerID)
	}
}

// measurePeerLatency measures latency to a single peer
func (ms *MetricsServer) measurePeerLatency(peerID peer.ID) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	result := <-ms.pingService.Ping(ctx, peerID)
	
	if result.Error == nil {
		ms.latencyCacheMu.Lock()
		ms.latencyCache[peerID] = result.RTT
		ms.latencyCacheMu.Unlock()
	}
}

// calculateLatencyStats returns avg, min, max latency in milliseconds
func (ms *MetricsServer) calculateLatencyStats() (avg, min, max float64) {
	ms.latencyCacheMu.RLock()
	defer ms.latencyCacheMu.RUnlock()
	
	if len(ms.latencyCache) == 0 {
		return 0, 0, 0
	}
	
	var total time.Duration
	minLat := time.Hour // Start with large value
	maxLat := time.Duration(0)
	
	for _, lat := range ms.latencyCache {
		total += lat
		if lat < minLat {
			minLat = lat
		}
		if lat > maxLat {
			maxLat = lat
		}
	}
	
	count := len(ms.latencyCache)
	avg = float64(total.Microseconds()) / float64(count) / 1000.0
	min = float64(minLat.Microseconds()) / 1000.0
	max = float64(maxLat.Microseconds()) / 1000.0
	
	return avg, min, max
}

// writeJSON writes a JSON response
func (ms *MetricsServer) writeJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	
	encoder := json.NewEncoder(w)
	encoder.SetIndent("", "  ")
	
	if err := encoder.Encode(data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
