package drills

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/HamedDawoudzai/ace-dsa/backend/internal/middleware"
)

type Handler struct {
	DB *sql.DB
}

type Drill struct {
	ID                   string   `json:"id"`
	PatternCategory      string   `json:"pattern_category"`
	Prompt               string   `json:"prompt"`
	Choices              []string `json:"choices"`
	CorrectOption        int      `json:"correct_option"`
	Hint                 string   `json:"hint"`
	Difficulty           string   `json:"difficulty"`
	TimeComplexity       string   `json:"time_complexity"`
	SpaceComplexity      string   `json:"space_complexity"`
	ComplexityChoices    []string `json:"complexity_choices"`
	CorrectComplexOption int      `json:"correct_complexity_option"`
	ComplexityHint       string   `json:"complexity_hint"`
	ProblemNumber        int      `json:"problem_number"`
	Explanation          string   `json:"explanation"`
	ExampleInput         string   `json:"example_input"`
	ExampleOutput        string   `json:"example_output"`
	ExampleExplanation   string   `json:"example_explanation"`
}

type Category struct {
	Name      string `json:"name"`
	Total     int    `json:"total"`
	Completed int    `json:"completed"`
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

	category := r.URL.Query().Get("category")

	var rows *sql.Rows
	var err error
	if category != "" {
		rows, err = h.DB.Query(
			`SELECT id, pattern_category, prompt, choices, correct_option,
			        hint, difficulty, time_complexity, space_complexity,
			        complexity_choices, correct_complexity_option, complexity_hint,
			        problem_number, explanation, example_input, example_output,
			        example_explanation
			 FROM drills WHERE pattern_category = $1
			 ORDER BY problem_number, created_at`, category)
	} else {
		rows, err = h.DB.Query(
			`SELECT id, pattern_category, prompt, choices, correct_option,
			        hint, difficulty, time_complexity, space_complexity,
			        complexity_choices, correct_complexity_option, complexity_hint,
			        problem_number, explanation, example_input, example_output,
			        example_explanation
			 FROM drills ORDER BY problem_number, created_at`)
	}
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var drills []Drill
	for rows.Next() {
		var d Drill
		var choicesJSON, complexJSON []byte
		if err := rows.Scan(&d.ID, &d.PatternCategory, &d.Prompt, &choicesJSON, &d.CorrectOption,
			&d.Hint, &d.Difficulty, &d.TimeComplexity, &d.SpaceComplexity,
			&complexJSON, &d.CorrectComplexOption, &d.ComplexityHint,
			&d.ProblemNumber, &d.Explanation, &d.ExampleInput, &d.ExampleOutput,
			&d.ExampleExplanation); err != nil {
			http.Error(w, "internal error", http.StatusInternalServerError)
			return
		}
		if err := json.Unmarshal(choicesJSON, &d.Choices); err != nil {
			d.Choices = []string{}
		}
		if err := json.Unmarshal(complexJSON, &d.ComplexityChoices); err != nil {
			d.ComplexityChoices = []string{}
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
	json.NewEncoder(w).Encode(drills)
}

func (h *Handler) Categories(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if h.DB == nil {
		http.Error(w, "database unavailable", http.StatusServiceUnavailable)
		return
	}

	userID := ""
	if uid, ok := r.Context().Value(middleware.UserIDKey).(string); ok {
		userID = uid
	}

	var rows *sql.Rows
	var err error
	if userID != "" {
		rows, err = h.DB.Query(
			`SELECT d.pattern_category, COUNT(d.id),
			        COUNT(CASE WHEN up.completed_at IS NOT NULL THEN 1 END)
			 FROM drills d
			 LEFT JOIN user_progress up ON up.drill_id = d.id AND up.user_id = $1
			 GROUP BY d.pattern_category
			 ORDER BY MIN(d.problem_number)`, userID)
	} else {
		rows, err = h.DB.Query(
			`SELECT d.pattern_category, COUNT(d.id), 0
			 FROM drills d
			 GROUP BY d.pattern_category
			 ORDER BY MIN(d.problem_number)`)
	}
	if err != nil {
		log.Printf("categories query error: %v", err)
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var cats []Category
	for rows.Next() {
		var c Category
		if err := rows.Scan(&c.Name, &c.Total, &c.Completed); err != nil {
			http.Error(w, "internal error", http.StatusInternalServerError)
			return
		}
		cats = append(cats, c)
	}
	if cats == nil {
		cats = []Category{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cats)
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
	var choicesJSON, complexJSON []byte
	err := h.DB.QueryRow(
		`SELECT id, pattern_category, prompt, choices, correct_option,
		        hint, difficulty, time_complexity, space_complexity,
		        complexity_choices, correct_complexity_option, complexity_hint,
		        problem_number, explanation, example_input, example_output,
		        example_explanation
		 FROM drills WHERE id = $1`, id,
	).Scan(&d.ID, &d.PatternCategory, &d.Prompt, &choicesJSON, &d.CorrectOption,
		&d.Hint, &d.Difficulty, &d.TimeComplexity, &d.SpaceComplexity,
		&complexJSON, &d.CorrectComplexOption, &d.ComplexityHint,
		&d.ProblemNumber, &d.Explanation, &d.ExampleInput, &d.ExampleOutput,
		&d.ExampleExplanation)
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
	if err := json.Unmarshal(complexJSON, &d.ComplexityChoices); err != nil {
		d.ComplexityChoices = []string{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(d)
}
