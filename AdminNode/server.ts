import express from "express"; 
import { startLibp2pNode } from "./index.js";
import { peerIdFromString } from '@libp2p/peer-id'
import { pipe } from "it-pipe";
import { multiaddr } from "@multiformats/multiaddr";
import { lpStream } from '@libp2p/utils'
import cors from "cors";

const app = express();
app.use(express.json());

let node: any = null;


app.use(cors({
  origin: "http://localhost:3000", // Next.js dev server
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.get("/test", async (req, res) => {
  res.send("Hello World");
});

app.post("/test", async (req, res) => {
  console.log("Got it!")

  const stream = await node.dialProtocol(multiaddr("/ip4/10.0.0.183/tcp/11111/p2p/QmSgsmq9ty6khBSjvM7fBCynimYUPFnWKkSJNb1uvGTFZ7"), '/print/1.0.0');

  stream.send(new TextEncoder().encode(req.body.message))

  console.log(stream)

  stream.close()

  const { message } = req.body;

  console.log("Received:", message);

  res.json({
    reply: `Server received: ${message}`,
  });
});


const PORT = 5000;
app.listen(PORT, async () => {
  node = await startLibp2pNode();
  console.log("🌐 HTTP API running on http://localhost:5000");

  //const stream = await node.dialProtocol(multiaddr("/ip4/10.0.0.183/tcp/11111/p2p/QmSgsmq9ty6khBSjvM7fBCynimYUPFnWKkSJNb1uvGTFZ7"), '/print/1.0.0');

  //stream.send(new TextEncoder().encode("Helloooooo"))

  //console.log(stream)

  //stream.close()


});
