package profile

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/HamedDawoudzai/ace-dsa/backend/internal/middleware"
	"golang.org/x/crypto/bcrypt"
)

type Handler struct {
	DB *sql.DB
}

type ProfileResp struct {
	ID        string    `json:"id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

type updateReq struct {
	FirstName *string `json:"first_name,omitempty"`
	LastName  *string `json:"last_name,omitempty"`
	Username  *string `json:"username,omitempty"`
}

type changePasswordReq struct {
	CurrentPassword string `json:"current_password"`
	NewPassword     string `json:"new_password"`
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

	var p ProfileResp
	err := h.DB.QueryRow(
		`SELECT id, first_name, last_name, username, email, created_at FROM users WHERE id = $1`, userID,
	).Scan(&p.ID, &p.FirstName, &p.LastName, &p.Username, &p.Email, &p.CreatedAt)
	if err == sql.ErrNoRows {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
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

	var req updateReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if req.FirstName != nil {
		h.DB.Exec(`UPDATE users SET first_name = $1, updated_at = NOW() WHERE id = $2`,
			strings.TrimSpace(*req.FirstName), userID)
	}
	if req.LastName != nil {
		h.DB.Exec(`UPDATE users SET last_name = $1, updated_at = NOW() WHERE id = $2`,
			strings.TrimSpace(*req.LastName), userID)
	}
	if req.Username != nil {
		u := strings.TrimSpace(strings.ToLower(*req.Username))
		if u == "" || len(u) < 3 || len(u) > 30 {
			http.Error(w, "username must be 3-30 characters", http.StatusBadRequest)
			return
		}
		_, err := h.DB.Exec(`UPDATE users SET username = $1, updated_at = NOW() WHERE id = $2`, u, userID)
		if err != nil && (strings.Contains(err.Error(), "users_username_key") || strings.Contains(err.Error(), "idx_users_username")) {
			http.Error(w, "username already taken", http.StatusConflict)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "updated"})
}

func (h *Handler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
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

	var req changePasswordReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	if req.CurrentPassword == "" || req.NewPassword == "" {
		http.Error(w, "current and new passwords required", http.StatusBadRequest)
		return
	}
	if len(req.NewPassword) < 8 {
		http.Error(w, "password must be at least 8 characters", http.StatusBadRequest)
		return
	}

	var hash string
	err := h.DB.QueryRow(`SELECT password_hash FROM users WHERE id = $1`, userID).Scan(&hash)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.CurrentPassword)); err != nil {
		http.Error(w, "current password is incorrect", http.StatusUnauthorized)
		return
	}

	newHash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	h.DB.Exec(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, string(newHash), userID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "password changed"})
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
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

	_, err := h.DB.Exec(`DELETE FROM users WHERE id = $1`, userID)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "account deleted"})
}

func (h *Handler) Progress(w http.ResponseWriter, r *http.Request) {
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
		`SELECT drill_id, approach_correct, complexity_correct, completed_at
		 FROM user_progress WHERE user_id = $1`, userID)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	type ProgressRow struct {
		DrillID          string     `json:"drill_id"`
		ApproachCorrect  bool       `json:"approach_correct"`
		ComplexityCorrect bool      `json:"complexity_correct"`
		CompletedAt      *time.Time `json:"completed_at"`
	}

	var progress []ProgressRow
	for rows.Next() {
		var p ProgressRow
		var completedAt sql.NullTime
		if err := rows.Scan(&p.DrillID, &p.ApproachCorrect, &p.ComplexityCorrect, &completedAt); err != nil {
			http.Error(w, "internal error", http.StatusInternalServerError)
			return
		}
		if completedAt.Valid {
			p.CompletedAt = &completedAt.Time
		}
		progress = append(progress, p)
	}
	if progress == nil {
		progress = []ProgressRow{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(progress)
}
