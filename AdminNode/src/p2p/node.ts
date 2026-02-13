import { createLibp2p, type Libp2p } from 'libp2p'
//import { PeerId } from '@libp2p/interface'
import { tcp } from "@libp2p/tcp";
import { tls } from '@libp2p/tls';
import { yamux } from "@chainsafe/libp2p-yamux";
import { privateKeyFromRaw } from '@libp2p/crypto/keys'
import { peerIdFromPrivateKey } from '@libp2p/peer-id'

import { multiaddr } from "@multiformats/multiaddr";

/**
 * LIBP2P NODE FILE
 * By Santiago Delgado
 * Updated: January 2026
 * 
 * All function regarding node operations
 * May use anotehr file for stream handlers in the future for better organization
 *  
 */


let node: Libp2p | null = null

export async function startNode(): Promise<Libp2p> {
    if (node) return node

    const base64Key = process.env.LIBP2P_PRIVKEY

    if (!base64Key) {
    throw new Error('LIBP2P_PRIVATE_KEY not set')
    }

    const rawKey = Buffer.from(base64Key, 'base64')
    const privateKey = privateKeyFromRaw(rawKey)
    // const peerId = await peerIdFromPrivateKey(privateKey)
    
    node = await createLibp2p({
        privateKey,
        addresses: {
        listen: [
            "/ip4/192.168.126.1/tcp/4001",
        ]
        },
        transports: [tcp()],
        connectionEncrypters: [tls()],
        streamMuxers: [yamux()],
    });

    //print protocol
    node.handle("/print/1.0.0", ( stream ) => {
        console.log("📥 Incoming stream on /print/1.0.0");

        stream.addEventListener('message', evt => {
        console.log(evt.data)
        stream.send(evt.data)
        })

        // close the incoming writable end when the remote writable end closes
        stream.addEventListener('remoteCloseWrite', () => {
            stream.close()
        })
    });

  await node.start()
  
  console.log('✅ libp2p node started:', node.peerId.toString())
  console.log('🌐 Listening on:', node.getMultiaddrs().map(String))

  // // Connect to bootstrap peers if configured
  // if (config.bootstrapPeers.length > 0) {
  //   console.log('📋 Connecting to bootstrap peers...')
  //   for (const peerAddr of config.bootstrapPeers) {
  //     try {
  //       const ma = multiaddr(peerAddr)
  //       await node.dial(ma)
  //       console.log(`   ✓ Connected to ${peerAddr.substring(0, 50)}...`)
  //     } catch (err) {
  //       console.log(`   ⚠️ Failed to connect to ${peerAddr.substring(0, 50)}...`)
  //     }
  //   }
  // }

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stream = await n.dialProtocol(multiaddr(peerMultiaddr), '/print/1.0.0') as any

  // Write message to the stream sink
  const encoder = new TextEncoder()
  await stream.sink([encoder.encode(message + '\n')])
  console.log('📤 Sent message to peer')

  await stream.close()
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
