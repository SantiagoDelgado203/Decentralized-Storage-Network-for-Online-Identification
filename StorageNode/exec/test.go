package exec

import (
	"node/core"
	"time"
)

func TestNode(idseed string) (err error) {

	//TODO: init()

	priv, err := core.PrivKeyFromSeed(idseed)
	if err != nil {
		panic(err)
	}

	//Start the node
	ctx, h, _, peers := core.NodeCreate(priv, "myapp")

	//connects to peers indefinitely
	go core.ConstantConnection(ctx, h, peers)

	//allow time for connection
	time.Sleep(5 * time.Second)

	select {}

}
