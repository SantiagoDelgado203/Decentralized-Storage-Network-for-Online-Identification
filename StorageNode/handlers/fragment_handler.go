package handlers

import (
	"encoding/json"
	"net/http"
	"node/models"
	"node/storage"
)

// FragmentHandler groups the fragment-related HTTP handlers.
type FragmentHandler struct {
	db *storage.Database
}

// NewFragmentHandler constructs a new FragmentHandler.
func NewFragmentHandler(db *storage.Database) *FragmentHandler {
	return &FragmentHandler{db: db}
}

// StoreFragmentHandler handles inserting a new Shamir share fragment.
func (h *FragmentHandler) StoreFragmentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var fragment models.Fragment
	if err := json.NewDecoder(r.Body).Decode(&fragment); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// At minimum, hash and share must be provided.
	if fragment.Hash == "" || fragment.Share == "" {
		http.Error(w, "Hash and share are required", http.StatusBadRequest)
		return
	}

	if fragment.Threshold <= 0 || fragment.Total <= 0 {
		http.Error(w, "Threshold and total must be positive", http.StatusBadRequest)
		return
	}

	if err := h.db.StoreFragment(fragment); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Fragment stored successfully",
		"hash":    fragment.Hash,
	})
}

// GetFragmentHandler returns all fragments belonging to a given hash.
func (h *FragmentHandler) GetFragmentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	hash := r.URL.Query().Get("hash")
	if hash == "" {
		http.Error(w, "Hash parameter is required", http.StatusBadRequest)
		return
	}

	fragments, err := h.db.RetrieveFragmentsByHash(hash)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(fragments)
}

// DeleteFragmentHandler deletes all fragments for a given hash.
func (h *FragmentHandler) DeleteFragmentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	hash := r.URL.Query().Get("hash")
	if hash == "" {
		http.Error(w, "Hash parameter is required", http.StatusBadRequest)
		return
	}

	if err := h.db.DeleteFragmentsByHash(hash); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Fragments deleted successfully",
		"hash":    hash,
	})
}
