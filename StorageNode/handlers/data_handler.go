package handlers

import (
	"encoding/json"
	"net/http"
	"node/core"s
)

// DataBlockHandler groups handlers for encrypted data blocks.
type DataBlockHandler struct {
	db *storage.Database
}

// NewDataBlockHandler constructs a new DataBlockHandler.
func NewDataBlockHandler(db *storage.Database) *DataBlockHandler {
	return &DataBlockHandler{db: db}
}

// StoreDataBlockHandler handles storing an encrypted data block.
func (h *DataBlockHandler) StoreDataBlockHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var block models.DataBlock
	if err := json.NewDecoder(r.Body).Decode(&block); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if block.Hash == "" || block.Cipher == "" {
		http.Error(w, "Hash and cipher are required", http.StatusBadRequest)
		return
	}

	if err := h.db.StoreDataBlock(block); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Data block stored successfully",
		"hash":    block.Hash,
	})
}

// GetDataBlockHandler retrieves an encrypted data block by hash.
func (h *DataBlockHandler) GetDataBlockHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	hash := r.URL.Query().Get("hash")
	if hash == "" {
		http.Error(w, "Hash parameter is required", http.StatusBadRequest)
		return
	}

	block, err := h.db.RetrieveDataBlock(hash)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(block)
}

// DeleteDataBlockHandler deletes a data block by hash.
func (h *DataBlockHandler) DeleteDataBlockHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	hash := r.URL.Query().Get("hash")
	if hash == "" {
		http.Error(w, "Hash parameter is required", http.StatusBadRequest)
		return
	}

	if err := h.db.DeleteDataBlock(hash); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Data block deleted successfully",
		"hash":    hash,
	})
}
