package stats

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/HamedDawoudzai/ace-dsa/backend/internal/middleware"
)

type Handler struct {
	DB *sql.DB
}

type PatternStats struct {
	Pattern string `json:"pattern"`
	Total   int    `json:"total"`
}

type StatsResp struct {
	Patterns []PatternStats `json:"patterns"`
	Streak   int            `json:"streak"`
}

func (h *Handler) Get(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, ok := r.Context().Value(middleware.UserIDKey).(string)
	if !ok || userID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	if h.DB == nil {
		http.Error(w, "database unavailable", http.StatusServiceUnavailable)
		return
	}

	rows, err := h.DB.Query(
		`SELECT d.pattern_category, COUNT(a.id)
		 FROM attempts a
		 JOIN drills d ON a.drill_id = d.id
		 WHERE a.user_id = $1
		 GROUP BY d.pattern_category`,
		userID,
	)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var patterns []PatternStats
	for rows.Next() {
		var p PatternStats
		if err := rows.Scan(&p.Pattern, &p.Total); err != nil {
			http.Error(w, "internal error", http.StatusInternalServerError)
			return
		}
		patterns = append(patterns, p)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	if patterns == nil {
		patterns = []PatternStats{}
	}

	var streak int
	err = h.DB.QueryRow(
		`SELECT COUNT(DISTINCT created_at::date) FROM attempts WHERE user_id = $1`,
		userID,
	).Scan(&streak)
	if err != nil && err != sql.ErrNoRows {
		streak = 0
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(StatsResp{Patterns: patterns, Streak: streak})
}
