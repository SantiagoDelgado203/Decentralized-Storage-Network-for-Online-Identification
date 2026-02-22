import { Router, type Request, type Response } from 'express'
import { multiaddr } from "@multiformats/multiaddr";
import { getNode, getConnectionInfo } from '../p2p/node'
import { DB_Request, User } from '../../Models';
import { createRequest, getProviderById, getRequests, getUserByEmail, updateRequest, upsertUser } from '../../Database';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

/**
 * API ROUTES FILE
 * By Santiago Delgado
 * Updated: January 2026
 * 
 * Express API endpoints for interacting with the network
 */


const router = Router()

dotenv.config({ quiet: true });
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || '5432'),
});




// Health check
router.get('/test', async (req, res) => {
  res.send('Hello World')
})

router.post('/net/upload', async (req: Request, res: Response) => {

  const node = getNode()
  const payload = req.body

  // Get bootstrap peer from env (set in docker-compose)
  const bootstrapPeer = process.env.DSN_BOOTSTRAP_PEERS || "/ip4/127.0.0.1/tcp/11111/p2p/QmaTPiRLg64y6wwYXybwsQLVUqqzqwpJSNQ8k5T5e6MyAG"

  try {
    const stream = await node.dialProtocol(
      multiaddr(bootstrapPeer),
      '/upload/1.0.0'
    )
    stream.send(new TextEncoder().encode(JSON.stringify(payload)))
    stream.close()

    res.json({
      reply: `User data forwarded to the network`
    })
  } catch (err) {
    console.error('Failed to dial storage node:', err)
    res.status(500).json({ error: 'Failed to connect to storage network' })
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

  //Get the request body
  const request_body = req.body

  //Create a new request
  const newRequest = new DB_Request({
    providerid: request_body.verifierID,
    userid: request_body.userID,
    companyname: request_body.company,
    datarequests: request_body.criteria,
    status: "Pending"
  })

  //try to create the request in the database
  try {
    await createRequest(pool,newRequest)
    res.json({
      reply: "Request created!"
    })
  } catch (e) {
    res.status(500)
  }
})

router.post("/db/get-requests", async (req: Request, res: Response) => {
  const request_body = req.body

  const requests = await getRequests(pool, {userid: request_body.userID, providerid: request_body.verifierID})

  res.json(requests)

})

router.post("/db/resolve-requests", async (req: Request, res: Response) => {
  console.log("Hey")
  const request_body = req.body

  const db_request = await getRequests(pool, {requestid: request_body.requestID})

  let updated_request = new DB_Request(db_request[0])

  if(request_body.accepted){
    //HERE IS WHERE WE DIAL THE NODE TO START THE VERIFICATION PROCESS
  }
  
  updated_request.status = request_body.accepted ? "Accepted" : "Rejected"

  const rep = await updateRequest(pool, updated_request)

  res.json(rep)

})


router.post("/db/update-request", async (req: Request, res: Response) => {
  const request_body = req.body

  const db_request = await getRequests(pool, {requestid: request_body.requestID})
  console.log(db_request)
  let updated_request = new DB_Request(db_request[0])

  updated_request.datarequests = request_body.criteria
  updated_request.status = request_body.status

  const rep = await updateRequest(pool, updated_request)

  res.json(rep)

})

router.post("/db/register", async (req: Request, res: Response) => {
  const request_body = req.body

  const user_check = await getUserByEmail(pool, request_body.email)

  console.log(user_check)

  if(user_check != null){
    res.json({
      reply :"User already exists"
    })
    return
  }

  const hash = await bcrypt.hash(request_body.password, 10);
  
  const new_user = new User({userid: "", email:request_body.email, hashedpassword: hash})
  upsertUser(pool, new_user)

  res.status(200).json({ reply: "User created" });

})

router.post("/db/login", async (req: Request, res: Response) => {
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
  }else{
    res.status(401).json({
      reply: "Wrong credentials"
    })
  }

})

export default router
