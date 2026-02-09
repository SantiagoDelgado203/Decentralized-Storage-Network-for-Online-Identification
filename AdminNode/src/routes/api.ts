import { Router, type Request, type Response } from 'express'
import { multiaddr } from "@multiformats/multiaddr";
import { getNode } from '../p2p/node'
import { DB_Request, User } from '../../Models';
import { createRequest, getProviderById, getRequests, getUserByEmail, updateRequest, upsertUser } from '../../Database';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

/**
 * API'S FILE
 * By Santiago Delgado
 * 
 * This file is where we can list all the api's endpoints
 */

const router = Router()

dotenv.config();
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || '5432'),
});

router.post('/net/upload', async (req: Request, res: Response) => {

  const node = getNode()
  const payload = req.body

  //dial storage network with new user protocol
  //TODO: replace static node multiaddress to random node from peerlist
  const stream = await node.dialProtocol(
    multiaddr("/ip4/10.0.0.183/tcp/28528/p2p/QmSgsmq9ty6khBSjvM7fBCynimYUPFnWKkSJNb1uvGTFZ7"),
    '/upload/1.0.0'
  )
  stream.send(new TextEncoder().encode(JSON.stringify(payload)))
  stream.close()

  //Here probably mark the user as synced or fully registred in the network in the database?

  res.json({
    reply: `User data forwarded to the network`
  })

})


router.get('/node-info', (req: Request, res: Response) => {
  const node = getNode()

  res.json({
    peerId: node.peerId.toString(),
    connections: node.getConnections().length,
  })
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
