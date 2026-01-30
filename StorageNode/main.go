package main

import (
	"fmt"
	"log"
	"node/exec"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		usage()
		os.Exit(1)
	}

	switch os.Args[1] {
	case "init":
		if err := exec.Init(); err != nil {
			log.Fatal(err)
		}
	case "run":
		if err := exec.NodeStart(); err != nil {
			log.Fatal(err)
		}
	case "test":
		if len(os.Args) < 3 {
			usage()
			os.Exit(1)
		}
		if err := exec.TestNode(os.Args[2]); err != nil {
			log.Fatal(err)
		}
	default:
		usage()
		os.Exit(1)
	}
}

func usage() {
	fmt.Println(
		`Usage: ./main [option]

Options:
  init			Run one-time initialization
  run			Start libp2p node
  test <seed>	Runs a test node with deterministic PeerID generated from given <seed>`)
}
