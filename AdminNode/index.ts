import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
 import { tls } from '@libp2p/tls';
import { yamux } from "@chainsafe/libp2p-yamux";
import { pipe } from "it-pipe";

export async function startLibp2pNode() {
  const node = await createLibp2p({
    addresses: {
      listen: [
        "/ip4/0.0.0.0/tcp/4001",
        "/ip4/0.0.0.0/tcp/4002/ws",
      ]
    },
    transports: [tcp()],
    connectionEncrypters: [tls()],
    streamMuxers: [yamux()],
  });

  node.handle("/print/1.0.0", ( stream ) => {
    console.log("📥 Incoming stream on /print/1.0.0");

    stream.addEventListener('message', evt => {
    console.log(evt.data)
    stream.send(evt.data)
  })

  // close the incoming writable end when the remote writable end closes
  stream.addEventListener('remoteCloseWrite', () => {
    stream.close()
  })
  });

  console.log("🚀 Libp2p node started");
  console.log("PeerId:", node.peerId.toString());
  console.log("Addrs:", node.getMultiaddrs().map(String));

  return node;
}
