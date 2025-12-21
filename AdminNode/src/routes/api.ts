import { Router, type Request, type Response } from 'express'
import { getNode } from '../p2p/node'

/**
 * API'S FILE
 * By Santiago Delgado
 * 
 * This file is where we can list all the api's endpoints
 */

const router = Router()

router.get('/node-info', (req: Request, res: Response) => {
  const node = getNode()

  res.json({
    peerId: node.peerId.toString(),
    connections: node.getConnections().length,
  })
})

export default router
