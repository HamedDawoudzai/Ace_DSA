package main

import (
	"database/sql"
	"embed"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/HamedDawoudzai/ace-dsa/backend/internal/db"
)

//go:embed nc150.json
var seedFS embed.FS

type Problem struct {
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
}

func main() {
	db.LoadDotEnv()

	database, err := db.Open()
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	if database == nil {
		log.Fatal("DB_URL not set")
	}
	defer database.Close()

	if err := db.Migrate(database); err != nil {
		log.Fatalf("migrate: %v", err)
	}

	data, err := seedFS.ReadFile("nc150.json")
	if err != nil {
		log.Fatalf("read seed file: %v", err)
	}

	var problems []Problem
	if err := json.Unmarshal(data, &problems); err != nil {
		log.Fatalf("parse seed file: %v", err)
	}

	if len(os.Args) > 1 && os.Args[1] == "--update" {
		updateAllFields(database, problems)
		return
	}

	log.Printf("seeding %d problems...", len(problems))

	inserted, skipped := 0, 0
	for _, p := range problems {
		choicesJSON, _ := json.Marshal(p.Choices)
		complexJSON, _ := json.Marshal(p.ComplexityChoices)

		var exists bool
		err := database.QueryRow(
			`SELECT EXISTS(SELECT 1 FROM drills WHERE pattern_category = $1 AND problem_number = $2)`,
			p.PatternCategory, p.ProblemNumber,
		).Scan(&exists)
		if err != nil {
			log.Printf("check #%d: %v", p.ProblemNumber, err)
			continue
		}
		if exists {
			skipped++
			continue
		}

		_, err = database.Exec(
			`INSERT INTO drills
				(pattern_category, prompt, choices, correct_option, hint,
				 difficulty, time_complexity, space_complexity,
				 complexity_choices, correct_complexity_option, complexity_hint,
				 problem_number, explanation)
			 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
			p.PatternCategory, p.Prompt, choicesJSON, p.CorrectOption, p.Hint,
			p.Difficulty, p.TimeComplexity, p.SpaceComplexity,
			complexJSON, p.CorrectComplexOption, p.ComplexityHint,
			p.ProblemNumber, p.Explanation,
		)
		if err != nil {
			log.Printf("insert #%d (%s): %v", p.ProblemNumber, p.Prompt[:min(40, len(p.Prompt))], err)
			continue
		}
		inserted++
	}

	log.Printf("done: %d inserted, %d skipped (already exist)", inserted, skipped)

	var count int
	database.QueryRow(`SELECT COUNT(*) FROM drills`).Scan(&count)
	fmt.Printf("total drills in DB: %d\n", count)
}

func updateAllFields(database *sql.DB, problems []Problem) {
	log.Printf("updating drills fields for %d problems...", len(problems))
	updated := 0
	for _, p := range problems {
		choicesJSON, _ := json.Marshal(p.Choices)
		complexJSON, _ := json.Marshal(p.ComplexityChoices)

		res, err := database.Exec(
			`UPDATE drills
			 SET prompt = $1,
			     choices = $2,
			     correct_option = $3,
			     hint = $4,
			     difficulty = $5,
			     time_complexity = $6,
			     space_complexity = $7,
			     complexity_choices = $8,
			     correct_complexity_option = $9,
			     complexity_hint = $10,
			     explanation = $11
			 WHERE pattern_category = $12 AND problem_number = $13`,
			p.Prompt, choicesJSON, p.CorrectOption, p.Hint,
			p.Difficulty, p.TimeComplexity, p.SpaceComplexity,
			complexJSON, p.CorrectComplexOption, p.ComplexityHint,
			p.Explanation,
			p.PatternCategory, p.ProblemNumber,
		)
		if err != nil {
			log.Printf("update #%d: %v", p.ProblemNumber, err)
			continue
		}
		n, _ := res.RowsAffected()
		if n > 0 {
			updated++
		}
	}
	log.Printf("done: %d drills updated", updated)
}

func clearAndReseed(database *sql.DB, problems []Problem) {
	database.Exec(`DELETE FROM user_progress`)
	database.Exec(`DELETE FROM attempts`)
	database.Exec(`DELETE FROM drills`)

	for _, p := range problems {
		choicesJSON, _ := json.Marshal(p.Choices)
		complexJSON, _ := json.Marshal(p.ComplexityChoices)
		database.Exec(
			`INSERT INTO drills
				(pattern_category, prompt, choices, correct_option, hint,
				 difficulty, time_complexity, space_complexity,
				 complexity_choices, correct_complexity_option, complexity_hint,
				 problem_number, explanation)
			 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
			p.PatternCategory, p.Prompt, choicesJSON, p.CorrectOption, p.Hint,
			p.Difficulty, p.TimeComplexity, p.SpaceComplexity,
			complexJSON, p.CorrectComplexOption, p.ComplexityHint,
			p.ProblemNumber, p.Explanation,
		)
	}
}
