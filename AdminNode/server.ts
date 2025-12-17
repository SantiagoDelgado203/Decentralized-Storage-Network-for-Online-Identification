import express from "express"; 
import { startLibp2pNode } from "./index.js";
import { peerIdFromString } from '@libp2p/peer-id'
import { pipe } from "it-pipe";
import { multiaddr } from "@multiformats/multiaddr";
import { lpStream } from '@libp2p/utils'

const app = express();
app.use(express.json());

let node: any = null;

app.post("/send", async (req, res) => {
    console.log("entrando en send")
  try {
    const { message, peer } = req.body;
    if (!node) return res.status(500).json({ error: "Node not ready" });
    console.log(peer, message)
    // dial peer using the protocol
    const stream = await node.dialProtocol(node.peer, "/print/1.0.0");
    
    stream.send(new TextEncoder().encode(message))
    stream.close()

    const output = await pipe(
      async function * () {
       // the stream input must be bytes
        yield new TextEncoder().encode(message)
      },
      stream,
      async (source) => {
        let string = ''
        const decoder = new TextDecoder()

        for await (const buf of source) {
          // buf is a `Uint8ArrayList` so we must turn it into a `Uint8Array`
          // before decoding it
          string += decoder.decode(buf.subarray())
        }

        return string
      }
    )

    console.log(output)

    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(5000, async () => {
  node = await startLibp2pNode();
  console.log("🌐 HTTP API running on http://localhost:5000");

  //const stream = await node.dialProtocol(multiaddr("/ip4/10.0.0.183/tcp/11111/p2p/QmSgsmq9ty6khBSjvM7fBCynimYUPFnWKkSJNb1uvGTFZ7"), '/print/1.0.0');

  //stream.send(new TextEncoder().encode("Helloooooo"))

  //console.log(stream)

  //stream.close()


});
