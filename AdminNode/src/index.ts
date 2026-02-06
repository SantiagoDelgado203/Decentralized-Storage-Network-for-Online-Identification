import app from './app'
import { startNode } from './p2p/node'
import '../Models'
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

/*STARTUP FILE
* By Santiago Delgado
* 
* This file is the one that will execute
* This file should have the node's main logic
*/

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || '5432'),
});

const PORT = 5000
async function start() {
  await startNode()

  app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`)    
  })

}

start().catch(err => {
  console.error(err)
  process.exit(1)
})
