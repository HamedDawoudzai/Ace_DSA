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

type CategoryStats struct {
	Name      string `json:"name"`
	Total     int    `json:"total"`
	Completed int    `json:"completed"`
}

type StatsResp struct {
	Categories     []CategoryStats `json:"categories"`
	TotalCompleted int             `json:"total_completed"`
	TotalProblems  int             `json:"total_problems"`
	TotalAttempts  int             `json:"total_attempts"`
	CorrectFirst   int             `json:"correct_first_try"`
	Streak         int             `json:"streak"`
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
		`SELECT d.pattern_category, COUNT(DISTINCT d.id),
		        COUNT(DISTINCT CASE WHEN up.completed_at IS NOT NULL THEN d.id END)
		 FROM drills d
		 LEFT JOIN user_progress up ON up.drill_id = d.id AND up.user_id = $1
		 GROUP BY d.pattern_category
		 ORDER BY MIN(d.problem_number)`, userID)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var cats []CategoryStats
	totalProblems, totalCompleted := 0, 0
	for rows.Next() {
		var c CategoryStats
		if err := rows.Scan(&c.Name, &c.Total, &c.Completed); err != nil {
			http.Error(w, "internal error", http.StatusInternalServerError)
			return
		}
		totalProblems += c.Total
		totalCompleted += c.Completed
		cats = append(cats, c)
	}
	if cats == nil {
		cats = []CategoryStats{}
	}

	var totalAttempts int
	h.DB.QueryRow(`SELECT COUNT(*) FROM attempts WHERE user_id = $1`, userID).Scan(&totalAttempts)

	var correctFirst int
	h.DB.QueryRow(
		`SELECT COUNT(DISTINCT drill_id) FROM attempts WHERE user_id = $1 AND is_correct = true`, userID,
	).Scan(&correctFirst)

	streak := calcStreak(h.DB, userID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(StatsResp{
		Categories:     cats,
		TotalCompleted: totalCompleted,
		TotalProblems:  totalProblems,
		TotalAttempts:  totalAttempts,
		CorrectFirst:   correctFirst,
		Streak:         streak,
	})
}

func (h *Handler) Reset(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
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

	if _, err := h.DB.Exec(`DELETE FROM user_progress WHERE user_id = $1`, userID); err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	if _, err := h.DB.Exec(`DELETE FROM attempts WHERE user_id = $1`, userID); err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "progress reset"})
}

func calcStreak(db *sql.DB, userID string) int {
	rows, err := db.Query(
		`SELECT DISTINCT completed_at::date
		 FROM user_progress
		 WHERE user_id = $1 AND completed_at IS NOT NULL
		 ORDER BY completed_at::date DESC`, userID)
	if err != nil {
		return 0
	}
	defer rows.Close()

	streak := 0
	var prev sql.NullTime
	for rows.Next() {
		var d sql.NullTime
		if err := rows.Scan(&d); err != nil || !d.Valid {
			break
		}
		if !prev.Valid {
			streak = 1
			prev = d
			continue
		}
		diff := prev.Time.Sub(d.Time).Hours() / 24
		if diff >= 0.5 && diff <= 1.5 {
			streak++
			prev = d
		} else {
			break
		}
	}
	return streak
}
