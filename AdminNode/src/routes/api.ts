import { Router, type Request, type Response } from 'express'
import { multiaddr } from "@multiformats/multiaddr";
import { getNode } from '../p2p/node'
import { DB_Request } from '../../Models';
import { createRequest, getProviderById, getRequests } from '../../Database';
import { Pool } from 'pg';
import dotenv from 'dotenv';

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

router.post('/net/user-info', async (req: Request, res: Response) => {

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
  console.log("Weeeeeee")
  const request_body = req.body

  const requests = await getRequests(pool, {userid: request_body.userID, providerid: request_body.verifierID})

  res.json(requests)

})

export default router
