import { Router, type Request, type Response } from 'express'
import { multiaddr } from "@multiformats/multiaddr";
import { getNode } from '../p2p/node'

/**
 * API'S FILE
 * By Santiago Delgado
 * 
 * This file is where we can list all the api's endpoints
 */

const router = Router()

router.get("/test", async (req, res) => {
  res.send("Hello World");
});

router.post("/test", async (req: Request, res: Response) => {
  const node = getNode()

  console.log("Got it!")
  const stream = await node.dialProtocol(multiaddr("/ip4/10.12.144.252/tcp/11111/p2p/QmSgsmq9ty6khBSjvM7fBCynimYUPFnWKkSJNb1uvGTFZ7"), '/print/1.0.0');

  stream.send(new TextEncoder().encode(req.body.message))

  console.log(stream)

  stream.close()

  const { message } = req.body;

  console.log("Received:", message);

  res.json({
    reply: `Server received: ${message}`,
  });
});


router.get('/node-info', (req: Request, res: Response) => {
  const node = getNode()

  res.json({
    peerId: node.peerId.toString(),
    connections: node.getConnections().length,
  })
})

export default router
