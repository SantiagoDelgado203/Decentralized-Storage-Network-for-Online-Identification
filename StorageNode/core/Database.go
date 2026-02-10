package core

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Database struct {
	client     *mongo.Client
	main       *mongo.Collection
	fragments  *mongo.Collection
	dataBlocks *mongo.Collection
	nodes      *mongo.Collection
}

// NewDatabase creates a new MongoDB client and initializes collections.
func NewDatabase(connectionString string) (*Database, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(connectionString))
	if err != nil {
		return nil, fmt.Errorf("failed to connect to MongoDB: %v", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		return nil, fmt.Errorf("failed to ping MongoDB: %v", err)
	}

	db := client.Database("didn_storage")

	return &Database{
		client:     client,
		main:       db.Collection("main"),
		fragments:  db.Collection("fragments"),
		dataBlocks: db.Collection("data_blocks"),
		nodes:      db.Collection("nodes"),
	}, nil
}

// ---------------- Shamir fragments (shares) ----------------

func (db *Database) StoreFragment(fragment Fragment) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	now := time.Now().UTC()
	fragment.CreatedAt = now
	fragment.UpdatedAt = now

	_, err := db.fragments.InsertOne(ctx, fragment)
	if err != nil {
		return fmt.Errorf("failed to store fragment: %v", err)
	}

	log.Printf("Fragment stored successfully, hash: %s, x: %d", fragment.Hash, fragment.X)
	return nil
}

func (db *Database) RetrieveFragmentsByHash(hash string) ([]Fragment, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := db.fragments.Find(ctx, bson.M{"hash": hash})
	if err != nil {
		return nil, fmt.Errorf("failed to query fragments: %v", err)
	}
	defer cursor.Close(ctx)

	var fragments []Fragment
	if err := cursor.All(ctx, &fragments); err != nil {
		return nil, fmt.Errorf("failed to decode fragments: %v", err)
	}

	if len(fragments) == 0 {
		return nil, fmt.Errorf("no fragments found for hash: %s", hash)
	}

	return fragments, nil
}

func (db *Database) DeleteFragmentsByHash(hash string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := db.fragments.DeleteMany(ctx, bson.M{"hash": hash})
	if err != nil {
		return fmt.Errorf("failed to delete fragments: %v", err)
	}

	if result.DeletedCount == 0 {
		return fmt.Errorf("no fragments found for deletion for hash: %s", hash)
	}

	log.Printf("Fragments deleted successfully for hash: %s, count: %d", hash, result.DeletedCount)
	return nil
}

// ---------------- Encrypted data blocks ----------------

func (db *Database) StoreDataBlock(block DataBlock) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	now := time.Now().UTC()
	block.CreatedAt = now
	block.UpdatedAt = now

	// optional: upsert by hash (overwrite same hash)
	// here we delete existing first to keep it simple
	_, _ = db.dataBlocks.DeleteOne(ctx, bson.M{"hash": block.Hash})

	_, err := db.dataBlocks.InsertOne(ctx, block)
	if err != nil {
		return fmt.Errorf("failed to store data block: %v", err)
	}

	log.Printf("Data block stored successfully, hash: %s", block.Hash)
	return nil
}

func (db *Database) RetrieveDataBlock(hash string) (*DataBlock, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var block DataBlock
	err := db.dataBlocks.FindOne(ctx, bson.M{"hash": hash}).Decode(&block)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("data block not found for hash: %s", hash)
		}
		return nil, fmt.Errorf("failed to retrieve data block: %v", err)
	}

	return &block, nil
}

func (db *Database) DeleteDataBlock(hash string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := db.dataBlocks.DeleteOne(ctx, bson.M{"hash": hash})
	if err != nil {
		return fmt.Errorf("failed to delete data block: %v", err)
	}
	if result.DeletedCount == 0 {
		return fmt.Errorf("data block not found for deletion: %s", hash)
	}

	log.Printf("Data block deleted successfully, hash: %s", hash)
	return nil
}

// ---------------- Node status ----------------

func (db *Database) UpdateNodeStatus(nodeID, address, status string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"node_id":   nodeID,
			"address":   address,
			"status":    status,
			"last_ping": time.Now().UTC(),
		},
		"$setOnInsert": bson.M{
			"storage_used": 0,
		},
	}

	opts := options.Update().SetUpsert(true)
	_, err := db.nodes.UpdateOne(ctx, bson.M{"node_id": nodeID}, update, opts)
	if err != nil {
		return fmt.Errorf("failed to update node status: %v", err)
	}

	return nil
}

func (db *Database) Close() error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return db.client.Disconnect(ctx)
}

//-----------------------------------------------------------------------

func (db *Database) StoreSimple(data SimpleData) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	now := time.Now().UTC()
	data.CreatedAt = now
	data.UpdatedAt = now

	_, err := db.main.InsertOne(ctx, data)
	if err != nil {
		return fmt.Errorf("failed to store fragment: %v", err)
	}

	log.Printf("Data stored successfully, hash: %s\n", data.Hash)
	return nil
}
