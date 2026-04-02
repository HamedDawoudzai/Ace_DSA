package attempts

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/HamedDawoudzai/ace-dsa/backend/internal/middleware"
)

type Handler struct {
	DB *sql.DB
}

type Attempt struct {
	ID               string    `json:"id"`
	UserID           string    `json:"user_id"`
	DrillID          string    `json:"drill_id"`
	ChosenOption     int       `json:"chosen_option"`
	IsCorrect        bool      `json:"is_correct"`
	ComplexityChosen *int      `json:"complexity_chosen,omitempty"`
	ComplexityCorr   *bool     `json:"complexity_correct,omitempty"`
	Completed        bool      `json:"completed"`
	Explanation      *string   `json:"explanation,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
}

type createReq struct {
	DrillID          string  `json:"drill_id"`
	ChosenOption     int     `json:"chosen_option"`
	IsCorrect        bool    `json:"is_correct"`
	ComplexityChosen *int    `json:"complexity_chosen,omitempty"`
	ComplexityCorr   *bool   `json:"complexity_correct,omitempty"`
	Completed        bool    `json:"completed"`
	Explanation      *string `json:"explanation,omitempty"`
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
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

	var req createReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	if req.DrillID == "" {
		http.Error(w, "drill_id required", http.StatusBadRequest)
		return
	}

	var correctOption int
	err := h.DB.QueryRow(`SELECT correct_option FROM drills WHERE id = $1`, req.DrillID).Scan(&correctOption)
	if err == sql.ErrNoRows {
		http.Error(w, "invalid drill_id", http.StatusBadRequest)
		return
	}
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	var expl sql.NullString
	if req.Explanation != nil {
		expl = sql.NullString{String: *req.Explanation, Valid: true}
	}
	var compChosen sql.NullInt32
	if req.ComplexityChosen != nil {
		compChosen = sql.NullInt32{Int32: int32(*req.ComplexityChosen), Valid: true}
	}
	var compCorr sql.NullBool
	if req.ComplexityCorr != nil {
		compCorr = sql.NullBool{Bool: *req.ComplexityCorr, Valid: true}
	}

	_, err = h.DB.Exec(
		`INSERT INTO attempts (user_id, drill_id, chosen_option, explanation,
		                       is_correct, complexity_chosen, complexity_correct, completed)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		userID, req.DrillID, req.ChosenOption, expl,
		req.IsCorrect, compChosen, compCorr, req.Completed,
	)
	if err != nil {
		if isForeignKeyViolation(err) {
			http.Error(w, "invalid drill_id or user", http.StatusBadRequest)
			return
		}
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	if req.Completed {
		_, _ = h.DB.Exec(
			`INSERT INTO user_progress (user_id, drill_id, approach_correct, complexity_correct, completed_at)
			 VALUES ($1, $2, true, true, NOW())
			 ON CONFLICT (user_id, drill_id) DO UPDATE
			 SET approach_correct = true, complexity_correct = true, completed_at = NOW()`,
			userID, req.DrillID,
		)
	}

	isCorrect := req.ChosenOption == correctOption

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":     "created",
		"is_correct": isCorrect,
	})
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
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
		`SELECT id, user_id, drill_id, chosen_option, explanation, created_at,
		        is_correct, complexity_chosen, complexity_correct, completed
		 FROM attempts WHERE user_id = $1 ORDER BY created_at DESC`, userID,
	)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var attempts []Attempt
	for rows.Next() {
		var a Attempt
		var expl sql.NullString
		var compChosen sql.NullInt32
		var compCorr sql.NullBool
		if err := rows.Scan(&a.ID, &a.UserID, &a.DrillID, &a.ChosenOption, &expl, &a.CreatedAt,
			&a.IsCorrect, &compChosen, &compCorr, &a.Completed); err != nil {
			http.Error(w, "internal error", http.StatusInternalServerError)
			return
		}
		if expl.Valid {
			a.Explanation = &expl.String
		}
		if compChosen.Valid {
			v := int(compChosen.Int32)
			a.ComplexityChosen = &v
		}
		if compCorr.Valid {
			a.ComplexityCorr = &compCorr.Bool
		}
		attempts = append(attempts, a)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	if attempts == nil {
		attempts = []Attempt{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(attempts)
}

func isForeignKeyViolation(err error) bool {
	if err == nil {
		return false
	}
	s := err.Error()
	return strings.Contains(s, "foreign key") || strings.Contains(s, "violates")
}
