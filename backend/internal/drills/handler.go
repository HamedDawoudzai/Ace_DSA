package drills

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
)

type Handler struct {
	DB *sql.DB
}

type Drill struct {
	ID              string   `json:"id"`
	PatternCategory string   `json:"pattern_category"`
	Prompt          string   `json:"prompt"`
	Choices         []string `json:"choices"`
	CorrectOption   int      `json:"correct_option"`
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if h.DB == nil {
		http.Error(w, "database unavailable", http.StatusServiceUnavailable)
		return
	}

	rows, err := h.DB.Query(`SELECT id, pattern_category, prompt, choices, correct_option FROM drills ORDER BY created_at DESC`)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var drills []Drill
	for rows.Next() {
		var d Drill
		var choicesJSON []byte
		if err := rows.Scan(&d.ID, &d.PatternCategory, &d.Prompt, &choicesJSON, &d.CorrectOption); err != nil {
			http.Error(w, "internal error", http.StatusInternalServerError)
			return
		}
		if err := json.Unmarshal(choicesJSON, &d.Choices); err != nil {
			d.Choices = []string{}
		}
		drills = append(drills, d)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	if drills == nil {
		drills = []Drill{}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(drills)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := strings.TrimPrefix(r.URL.Path, "/drills/")
	if id == "" {
		http.Error(w, "drill id required", http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		http.Error(w, "database unavailable", http.StatusServiceUnavailable)
		return
	}

	var d Drill
	var choicesJSON []byte
	err := h.DB.QueryRow(
		`SELECT id, pattern_category, prompt, choices, correct_option FROM drills WHERE id = $1`, id,
	).Scan(&d.ID, &d.PatternCategory, &d.Prompt, &choicesJSON, &d.CorrectOption)
	if err == sql.ErrNoRows {
		http.Error(w, "drill not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	if err := json.Unmarshal(choicesJSON, &d.Choices); err != nil {
		d.Choices = []string{}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(d)
}
