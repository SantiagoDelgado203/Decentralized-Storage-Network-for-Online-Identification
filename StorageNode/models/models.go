package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Fragment represents one Shamir share stored in the NoSQL layer.
type Fragment struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Hash      string             `bson:"hash" json:"hash"`           // identifier for a set of shares
	Share     string             `bson:"share" json:"share"`         // base64-encoded Shamir share (or other encoding)
	X         int                `bson:"x" json:"x"`                 // x-coordinate of the share
	Threshold int                `bson:"threshold" json:"threshold"` // k in k-of-n
	Total     int                `bson:"total" json:"total"`         // n in k-of-n
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

// DataBlock represents an encrypted data block associated with a secret.
type DataBlock struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Hash      string             `bson:"hash" json:"hash"`     // same hash as the related shares
	Cipher    string             `bson:"cipher" json:"cipher"` // encrypted data (e.g. base64-encoded ciphertext)
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

// NodeMetadata stores metadata for a storage node in the network.
type NodeMetadata struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	NodeID      string             `bson:"node_id" json:"node_id"`
	Address     string             `bson:"address" json:"address"`
	Status      string             `bson:"status" json:"status"`             // e.g. "active", "inactive"
	StorageUsed int64              `bson:"storage_used" json:"storage_used"` // bytes
	LastPing    time.Time          `bson:"last_ping" json:"last_ping"`
}
