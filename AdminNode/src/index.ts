import app from './app'
import { startNode } from './p2p/node'
import '../Models'
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
import { checkDatabase, createRequest, getRequests, upsertProvider, upsertUser } from '../Database'
import '../Models'
import { Provider, DB_Request, User } from '../Models';
import {decryptData, encryptData} from '../SymmetricEncryption'

/*STARTUP FILE
* By Santiago Delgado
* 
* This file is the one that will execute
* This file should have the node's main logic
*/

dotenv.config();
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || '5432'),
});

const PORT = 5000
/**
 * STARTUP FILE
 * By Santiago Delgado
 * Updated: January 2026
 * 
 * Main entry point for AdminNode
 * Starts the libp2p node and Express API server
 */
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
