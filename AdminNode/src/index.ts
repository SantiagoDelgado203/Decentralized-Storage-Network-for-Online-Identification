import app from './app'
import { startNode } from './p2p/node'

/**STARTUP FILE
* By Santiago Delgado
* 
* This file is the one that will execute
* This file should containt the node's main logic
*/

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
