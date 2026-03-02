package attempts
//handler to handle the user's drill attempts and store them in the database
import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/HamedDawoudzai/ace-dsa/backend/internal/middleware"
)

type Handler struct {
	DB *sql.DB
}

type createReq struct {
	DrillID       string  `json:"drill_id"`
	ChosenOption  int     `json:"chosen_option"`
	Explanation   *string `json:"explanation,omitempty"`
}
//Create a new drill attempt
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	//get the user ID from the context
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

	var expl sql.NullString
	if req.Explanation != nil {
		expl = sql.NullString{String: *req.Explanation, Valid: true}
	}

	_, err := h.DB.Exec(
		`INSERT INTO attempts (user_id, drill_id, chosen_option, explanation) VALUES ($1, $2, $3, $4)`,
		userID, req.DrillID, req.ChosenOption, expl,
	)
	if err != nil {
		if isForeignKeyViolation(err) {
			http.Error(w, "invalid drill_id or user", http.StatusBadRequest)
			return
		}
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "created"})
}

func isForeignKeyViolation(err error) bool {
	if err == nil {
		return false
	}
	s := err.Error()
	return strings.Contains(s, "foreign key") || strings.Contains(s, "violates")
}
