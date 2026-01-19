import { Router, type Request, type Response } from 'express'
import { multiaddr } from "@multiformats/multiaddr";
import { getNode } from '../p2p/node'
import { request } from 'node:http';

/**
 * API'S FILE
 * By Santiago Delgado
 * 
 * This file is where we can list all the api's endpoints
 */

const router = Router()

router.post("/test", async (req: Request, res: Response) => {

  const node = getNode()

  console.log("Got it!")

  const { message } = req.body;

  console.log("Received:", JSON.parse(message));

  res.json({
    reply: `Server received: ${message}`,
  });

  const stream = await node.dialProtocol(multiaddr("/ip4/10.12.144.252/tcp/11111/p2p/QmSgsmq9ty6khBSjvM7fBCynimYUPFnWKkSJNb1uvGTFZ7"), '/print/1.0.0');

  stream.send(new TextEncoder().encode(req.body.message))

  console.log(stream)

  stream.close()

  
});

router.post('/user-info', async (req: Request, res: Response) => {

  const node = getNode()
  const in_payload = req.body
  const user_data = in_payload.user_data
  const admin_signature = in_payload.admin_signature

  //TODO: check validity
  if(!admin_signature){
    res.json({
      reply: `Invalid admin credentials!`
    })
    return
  }

  //TODO: encrypt

  const encrypted_user = "foo"
  const symmetric_key = "foo"

  const out_payload = {
    u: encrypted_user,
    k: symmetric_key
  }

  //dial storage network with new user protocol
  //TODO: replace static node multiaddress to random node from peerlist
  const stream = await node.dialProtocol(
    multiaddr("/ip4/10.0.0.183/tcp/57692/p2p/QmSgsmq9ty6khBSjvM7fBCynimYUPFnWKkSJNb1uvGTFZ7"),
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

export default router
