import app from './app'
import { startNode } from './p2p/node'
import { checkDatabase, createRequest, getRequests, upsertProvider, upsertUser } from '../Database'
import '../Models'
import { Pool } from 'pg';
import dotenv from 'dotenv';
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
async function start() {
  await startNode()

  app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`)

    // const input = "Hello Admin";
    // const key = Buffer.from("12345678901234567890123456789012"); 

    // const encrypted = encryptData(input, key);

    // console.log("Encrypted output:", encrypted);

    // try {
    //     const result = decryptData(encrypted, key);
    //     console.log("Decrypted output:", result);
    // } catch (err) {
    //     console.error("Decryption failed:", err);
    // }

  })
  // checkDatabase(pool)
  // const new_user = await upsertUser(pool, new User({
  //   email: "santiago@test.com", 
  //   hashedpassword: "secure password 123", 
  //   salt: "123123"}))
  // const new_provider = await upsertProvider(pool, new Provider({
  //   registeredname: "Facebook", 
  //   hashedpassword: "Password123", 
  //   salt: "Salt"
  // }))
  // const new_request = await createRequest(pool, new Request({
  //   providerid: new_provider.providerid,
  //   userid: new_user.userid,
  //   companyname: new_provider.registeredname,
  //   datarequests: '{"test":"Hello World!"}',
  //   status: "Pending"
  // }))
  // console.log(new_user, new_provider, new_request)
  console.log(await getRequests(pool, {userid: "9a3fc47b-98b2-4d51-bb5e-a4a641812ebb"}))
}

start().catch(err => {
  console.error(err)
  process.exit(1)
})
