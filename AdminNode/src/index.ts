/**
 * STARTUP FILE
 * By Santiago Delgado
 * Updated: January 2026
 * 
 * Main entry point for AdminNode
 * Starts the libp2p node and Express API server
 */

import app from './app.js'
import { startNode } from './p2p/node.js'
import { getConfig } from './config.js'

async function start() {
  const config = getConfig()

  console.log('🚀 Starting AdminNode...')
  console.log(`   API Port: ${config.apiPort}`)
  console.log(`   P2P Port: ${config.p2pPort}`)
  console.log(`   P2P WS Port: ${config.p2pWsPort}`)
  console.log(`   CORS Origins: ${config.corsOrigins.join(', ')}`)
  
  if (config.bootstrapPeers.length > 0) {
    console.log(`   Bootstrap Peers: ${config.bootstrapPeers.length} configured`)
  }

  // Start libp2p node
  await startNode()

  // Start Express API server
  app.listen(config.apiPort, () => {
    console.log(`✅ API running at http://localhost:${config.apiPort}`)
  })
}

start().catch(err => {
  console.error('❌ Failed to start AdminNode:', err)
  process.exit(1)
})
