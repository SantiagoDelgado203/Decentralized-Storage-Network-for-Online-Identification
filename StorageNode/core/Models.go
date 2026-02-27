package core

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SimpleData struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Hash      string             `bson:"hash" json:"hash"`
	Data      string             `bson:"cipher" json:"data"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

type ResourceRequest struct {
	Hash string `bson:"hash" json:"hash"`
}

type VerificationRequest struct {
	UserID   string         `json:"userid"`
	Criteria map[string]any `json:"criteria"`
}

type Operation string

const (
	Equals  Operation = "equals"
	Minimum Operation = "minimum"
	Maximum Operation = "maximum"
)

// ---- Criteria Interface (Union Base) ----

type Criteria interface {
	isCriteria()
}

// ---- Rule ----

type Rule struct {
	Type      string      `json:"type"` // should be "Rule"
	Field     string      `json:"field"`
	Operation Operation   `json:"operation"`
	Value     interface{} `json:"value"` // string | number
}

func (Rule) isCriteria() {}

// ---- Logical Expression (AND / OR) ----

type LogicalExpressionType string

const (
	AND LogicalExpressionType = "AND"
	OR  LogicalExpressionType = "OR"
)

type LogicalExpression struct {
	Type     LogicalExpressionType `json:"type"`
	Criteria []Criteria            `json:"criteria"`
}

func (LogicalExpression) isCriteria() {}

// ---- NOT Expression ----

type NotExpression struct {
	Type     string   `json:"type"` // should be "NOT"
	Criteria Criteria `json:"criteria"`
}

func (NotExpression) isCriteria() {}

type UploadRequest struct {
	UserID string         `json:"userid"`
	Data   map[string]any `json:"data"`
}
