/**
 * API ROUTES FILE
 * By Santiago Delgado
 * Updated: January 2026
 * 
 * Express API endpoints for interacting with the network
 */

import { Router, type Request, type Response } from 'express'
import { getNode, dialPeer, getConnectionInfo } from '../p2p/node.js'
import { multiaddr } from '@multiformats/multiaddr'

const router = Router()

// Health check
router.get('/test', async (req, res) => {
  res.send('Hello World')
})

// Send a message to a peer
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { peerAddress, message } = req.body

    if (!peerAddress || !message) {
      res.status(400).json({ error: 'peerAddress and message are required' })
      return
    }

    await dialPeer(peerAddress, message)

    res.json({
      success: true,
      message: `Sent to ${peerAddress}`,
    })
  } catch (err) {
    console.error('Send error:', err)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// Forward user info to storage network
router.post('/net/user-info', async (req: Request, res: Response) => {
  try {
    const node = getNode()
    const in_payload = req.body
    const user_id = in_payload.UID
    const user_data = in_payload.user_data

    //TODO: encrypt
    console.log(in_payload)

    const encrypted_user = "foo"
    const symmetric_key = "foo"

    const out_payload = {
      id: user_id,
      u: encrypted_user,
      k: symmetric_key
    }

    //dial storage network with new user protocol
    //TODO: replace static node multiaddress to random node from peerlist
    const stream = await node.dialProtocol(
      multiaddr("/ip4/10.0.0.183/tcp/29427/p2p/QmSgsmq9ty6khBSjvM7fBCynimYUPFnWKkSJNb1uvGTFZ7"),
      '/new-user/1.0.0'
    )
    stream.send(new TextEncoder().encode(JSON.stringify(out_payload)))
    stream.close()

    res.json({
      reply: `User data processed and forwarded to the network`
    })
  } catch (err) {
    console.error('User info error:', err)
    res.status(500).json({ error: 'Failed to process user info' })
  }
})

// Legacy test endpoint (for backwards compatibility)
router.post('/test', async (req: Request, res: Response) => {
  try {
    const { message, peerAddress } = req.body

    if (!peerAddress) {
      res.status(400).json({ error: 'peerAddress is required' })
      return
    }

    const node = getNode()
    const stream = await node.dialProtocol(multiaddr(peerAddress), '/print/1.0.0')
    stream.send(new TextEncoder().encode(message))
    stream.close()

    res.json({
      reply: `Server sent: ${message}`,
    })
  } catch (err) {
    console.error('Test error:', err)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// Get node information
router.get('/node-info', (req: Request, res: Response) => {
  try {
    const info = getConnectionInfo()
    res.json(info)
  } catch (err) {
    res.status(500).json({ error: 'Node not started' })
  }
})

// List connected peers
router.get('/peers', (req: Request, res: Response) => {
  try {
    const node = getNode()
    const connections = node.getConnections()
    
    res.json({
      count: connections.length,
      peers: connections.map(conn => ({
        peerId: conn.remotePeer.toString(),
        address: conn.remoteAddr.toString(),
      })),
    })
  } catch (err) {
    res.status(500).json({ error: 'Node not started' })
  }
})

export default router
