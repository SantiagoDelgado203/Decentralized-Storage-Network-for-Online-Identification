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
	client *mongo.Client
	main   *mongo.Collection
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
		client: client,
		main:   db.Collection("main"),
	}, nil
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
		return fmt.Errorf("failed to store data: %v", err)
	}

	log.Printf("Data stored successfully, hash: %s\n", data.Hash)
	return nil
}

func (db *Database) RetrieveSimpleData(hash string) ([]SimpleData, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := db.main.Find(ctx, bson.M{"hash": hash})
	if err != nil {
		return nil, fmt.Errorf("failed to query data: %v", err)
	}
	defer cursor.Close(ctx)

	var data []SimpleData
	if err := cursor.All(ctx, &data); err != nil {
		return nil, fmt.Errorf("failed to decode data: %v", err)
	}

	if len(data) == 0 {
		return nil, fmt.Errorf("no data found for hash: %s", hash)
	}

	return data, nil
}

func (db *Database) DeleteDatabyHash(hash string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := db.main.DeleteMany(ctx, bson.M{"hash": hash})
	if err != nil {
		return fmt.Errorf("failed to delete data: %v", err)
	}

	if result.DeletedCount == 0 {
		return fmt.Errorf("no fragments found for deletion for hash: %s", hash)
	}

	log.Printf("Fragments deleted successfully for hash: %s, count: %d", hash, result.DeletedCount)
	return nil
}

func (db *Database) RetrieveAllHashes() ([]string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Only return the "hash" field, exclude _id
	projection := bson.M{
		"hash": 1,
		"_id":  0,
	}

	cursor, err := db.main.Find(ctx, bson.M{}, options.Find().SetProjection(projection))
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve hashes: %v", err)
	}
	defer cursor.Close(ctx)

	var results []struct {
		Hash string `bson:"hash"`
	}

	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("failed to decode hashes: %v", err)
	}

	hashes := make([]string, 0, len(results))
	for _, r := range results {
		hashes = append(hashes, r.Hash)
	}

	return hashes, nil
}
