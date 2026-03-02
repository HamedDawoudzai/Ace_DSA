package drills

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type Handler struct {
	DB *sql.DB
}

type Drill struct {
	ID              string   `json:"id"`
	PatternCategory string   `json:"pattern_category"`
	Prompt          string   `json:"prompt"`
	Choices         []string `json:"choices"`
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

	rows, err := h.DB.Query(`SELECT id, pattern_category, prompt, choices FROM drills ORDER BY created_at DESC`)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var drills []Drill
	for rows.Next() {
		var d Drill
		var choicesJSON []byte
		if err := rows.Scan(&d.ID, &d.PatternCategory, &d.Prompt, &choicesJSON); err != nil {
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
