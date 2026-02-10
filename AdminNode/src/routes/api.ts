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
import { DB_Request, User } from '../../Models.js'
import { createRequest, getProviderById, getRequests, getUserByEmail, updateRequest, upsertUser } from '../../Database.js'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import * as bcrypt from 'bcryptjs'

const router = Router()

dotenv.config()
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || '5432'),
})

// Health check
router.get('/test', async (req, res) => {
  res.send('Hello World')
})

// Upload data to storage network
router.post('/net/upload', async (req: Request, res: Response) => {
  try {
    const node = getNode()
    const payload = req.body

    // Get a peer from the network to dial
    const peers = node.getConnections()
    if (peers.length === 0) {
      res.status(503).json({ error: 'No peers connected' })
      return
    }

    const peerAddr = peers[0].remoteAddr.toString() + '/p2p/' + peers[0].remotePeer.toString()
    
    const stream = await node.dialProtocol(
      multiaddr(peerAddr),
      '/upload/1.0.0'
    )
    stream.send(new TextEncoder().encode(JSON.stringify(payload)))
    stream.close()

    res.json({
      reply: `User data forwarded to the network`
    })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Failed to upload data' })
  }
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

    // Get a peer from the network to dial
    const peers = node.getConnections()
    if (peers.length === 0) {
      res.status(503).json({ error: 'No peers connected' })
      return
    }

    const peerAddr = peers[0].remoteAddr.toString() + '/p2p/' + peers[0].remotePeer.toString()

    const stream = await node.dialProtocol(
      multiaddr(peerAddr),
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

router.post("/db/request-verification", async (req: Request, res: Response) => {
  try {
    const request_body = req.body

    const newRequest = new DB_Request({
      providerid: request_body.verifierID,
      userid: request_body.userID,
      companyname: request_body.company,
      datarequests: request_body.criteria,
      status: "Pending"
    })

    await createRequest(pool, newRequest)
    res.json({
      reply: "Request created!"
    })
  } catch (e) {
    console.error('Request verification error:', e)
    res.status(500).json({ error: 'Failed to create request' })
  }
})

router.post("/db/get-requests", async (req: Request, res: Response) => {
  try {
    const request_body = req.body
    const requests = await getRequests(pool, {userid: request_body.userID, providerid: request_body.verifierID})
    res.json(requests)
  } catch (e) {
    console.error('Get requests error:', e)
    res.status(500).json({ error: 'Failed to get requests' })
  }
})

router.post("/db/resolve-requests", async (req: Request, res: Response) => {
  try {
    const request_body = req.body
    const db_request = await getRequests(pool, {requestid: request_body.requestID})

    let updated_request = new DB_Request(db_request[0])

    if(request_body.accepted){
      //HERE IS WHERE WE DIAL THE NODE TO START THE VERIFICATION PROCESS
    }
    
    updated_request.status = request_body.accepted ? "Accepted" : "Rejected"

    const rep = await updateRequest(pool, updated_request)
    res.json(rep)
  } catch (e) {
    console.error('Resolve requests error:', e)
    res.status(500).json({ error: 'Failed to resolve request' })
  }
})

router.post("/db/update-request", async (req: Request, res: Response) => {
  try {
    const request_body = req.body
    const db_request = await getRequests(pool, {requestid: request_body.requestID})
    
    let updated_request = new DB_Request(db_request[0])
    updated_request.datarequests = request_body.criteria
    updated_request.status = request_body.status

    const rep = await updateRequest(pool, updated_request)
    res.json(rep)
  } catch (e) {
    console.error('Update request error:', e)
    res.status(500).json({ error: 'Failed to update request' })
  }
})

router.post("/db/register", async (req: Request, res: Response) => {
  try {
    const request_body = req.body
    const user_check = await getUserByEmail(pool, request_body.email)

    if(user_check != null){
      res.json({
        reply: "User already exists"
      })
      return
    }

    const hash = await bcrypt.hash(request_body.password, 10)
    const new_user = new User({userid: "", email: request_body.email, hashedpassword: hash})
    await upsertUser(pool, new_user)

    res.status(200).json({ reply: "User created" })
  } catch (e) {
    console.error('Register error:', e)
    res.status(500).json({ error: 'Failed to register user' })
  }
})

router.post("/db/login", async (req: Request, res: Response) => {
  try {
    const request_body = req.body
    const user = await getUserByEmail(pool, request_body.email)
    
    if(user == null){
      res.status(404).json({
        reply: "User not found."
      })
      return
    }

    const check_password = await bcrypt.compare(request_body.password, user.hashedpassword)

    if(check_password){
      res.status(200).json({
        reply: "Successfully logged in"
      })
    } else {
      res.status(401).json({
        reply: "Wrong credentials"
      })
    }
  } catch (e) {
    console.error('Login error:', e)
    res.status(500).json({ error: 'Failed to login' })
  }
})

export default router
