package exec

/*
TODO: Set up everything that is needed, including:

- NoSQL database set up

- Generate digital certificate/identity document

- Check existence of peerlist

- Any other additional configurations

If something goes wrong, do not return anithing. Use panic() instead with a error message
*/

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"

	"node/core" // 如果你 zip 里的 core 包路径不是 node/core，按实际改

	"github.com/libp2p/go-libp2p/core/crypto"
)

const (
	idFile        = "ID.json"
	bootstrapFile = "Bootstrap.txt"
)

// 建议你用环境变量，方便 5 台电脑改连接串
func mongoURI() string {
	if v := os.Getenv("MONGO_URI"); v != "" {
		return v
	}
	return "mongodb://localhost:27017"
}

func Init() error {
	fmt.Println("🔧 Init start...")

	// 1) Bootstrap.txt
	if _, err := os.Stat(bootstrapFile); os.IsNotExist(err) {
		if err := os.WriteFile(bootstrapFile, []byte(""), 0644); err != nil {
			panic(fmt.Sprintf("Init: create %s failed: %v", bootstrapFile, err))
		}
		fmt.Println("✅ Bootstrap.txt created")
	} else {
		fmt.Println("✅ Bootstrap.txt exists")
	}

	// 2) ID.json
	if _, err := os.Stat(idFile); os.IsNotExist(err) {
		priv, pub, err := crypto.GenerateEd25519Key(rand.Reader)
		if err != nil {
			panic(fmt.Sprintf("Init: generate key failed: %v", err))
		}

		privBytes, err := crypto.MarshalPrivateKey(priv)
		if err != nil {
			panic(fmt.Sprintf("Init: marshal priv failed: %v", err))
		}
		pubBytes, err := crypto.MarshalPublicKey(pub)
		if err != nil {
			panic(fmt.Sprintf("Init: marshal pub failed: %v", err))
		}

		keys := core.BootstrapKeys{
			PrivateKey: base64.StdEncoding.EncodeToString(privBytes),
			PublicKey:  base64.StdEncoding.EncodeToString(pubBytes),
		}

		b, err := json.MarshalIndent(keys, "", "  ")
		if err != nil {
			panic(fmt.Sprintf("Init: marshal ID.json failed: %v", err))
		}
		if err := os.WriteFile(idFile, b, 0600); err != nil {
			panic(fmt.Sprintf("Init: write ID.json failed: %v", err))
		}
		fmt.Println("✅ ID.json created")
	} else {
		fmt.Println("✅ ID.json exists")
	}

	// 3) MongoDB connect test (关键)
	fmt.Println("🔌 Checking MongoDB:", mongoURI())
	db, err := core.NewDatabase(mongoURI())
	if err != nil {
		panic(fmt.Sprintf("Init: MongoDB connect failed: %v", err))
	}
	_ = db.Close()
	fmt.Println("✅ MongoDB OK")

	fmt.Println("🎉 Init complete")
	return nil
}
