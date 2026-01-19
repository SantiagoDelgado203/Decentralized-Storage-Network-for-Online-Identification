/**
 * LIBP2P NODE FILE
 * By Santiago Delgado
 * Updated: January 2026
 * 
 * All functions regarding node operations
 * Now supports configuration via environment variables
 */

import { createLibp2p, type Libp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { tls } from '@libp2p/tls'
import { yamux } from '@chainsafe/libp2p-yamux'
import { multiaddr } from '@multiformats/multiaddr'
import { getConfig } from '../config.js'

let node: Libp2p | null = null

export async function startNode(): Promise<Libp2p> {
  if (node) return node

  const config = getConfig()

  node = await createLibp2p({
    addresses: {
      listen: [
        `/ip4/0.0.0.0/tcp/${config.p2pPort}`,
        `/ip4/0.0.0.0/tcp/${config.p2pWsPort}/ws`,
      ]
    },
    transports: [tcp()],
    connectionEncrypters: [tls()],
    streamMuxers: [yamux()],
  })

  // Print protocol handler
  node.handle('/print/1.0.0', (data) => {
    const { stream } = data
    console.log('📥 Incoming stream on /print/1.0.0')

    stream.addEventListener('message', evt => {
      console.log('Message received:', evt.data)
      stream.send(evt.data)
    })

    stream.addEventListener('remoteCloseWrite', () => {
      stream.close()
    })
  })

  await node.start()
  
  console.log('✅ libp2p node started:', node.peerId.toString())
  console.log('🌐 Listening on:', node.getMultiaddrs().map(String))

  // Connect to bootstrap peers if configured
  if (config.bootstrapPeers.length > 0) {
    console.log('📋 Connecting to bootstrap peers...')
    for (const peerAddr of config.bootstrapPeers) {
      try {
        const ma = multiaddr(peerAddr)
        await node.dial(ma)
        console.log(`   ✓ Connected to ${peerAddr.substring(0, 50)}...`)
      } catch (err) {
        console.log(`   ⚠️ Failed to connect to ${peerAddr.substring(0, 50)}...`)
      }
    }
  }

  return node
}

export function getNode(): Libp2p {
  if (!node) {
    throw new Error('libp2p node not started')
  }
  return node
}

/**
 * Dial a peer and send a message using the print protocol
 */
export async function dialPeer(peerMultiaddr: string, message: string): Promise<void> {
  const n = getNode()
  const stream = await n.dialProtocol(multiaddr(peerMultiaddr), '/print/1.0.0')

  stream.send(new TextEncoder().encode(message))
  console.log('📤 Sent message to peer')

  stream.close()
}

/**
 * Get connection information
 */
export function getConnectionInfo() {
  const n = getNode()
  return {
    peerId: n.peerId.toString(),
    multiaddrs: n.getMultiaddrs().map(String),
    connections: n.getConnections().length,
    peers: n.getConnections().map(c => c.remotePeer.toString()),
  }
}
