import app from './app'
import { startNode } from './p2p/node'
import {decryptData, encryptData} from '../SymmetricEncryption'

/**STARTUP FILE
* By Santiago Delgado
* 
* This file is the one that will execute
* This file should have the node's main logic
*/

const PORT = 5000
async function start() {
  await startNode()

  app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`)

    const input = "Hello Admin";
    const key = Buffer.from("12345678901234567890123456789012"); 

    const encrypted = encryptData(input, key);

    console.log("Encrypted output:", encrypted);

    try {
        const result = decryptData(encrypted, key);
        console.log("Decrypted output:", result);
    } catch (err) {
        console.error("Decryption failed:", err);
    }

  })
}

start().catch(err => {
  console.error(err)
  process.exit(1)
})
