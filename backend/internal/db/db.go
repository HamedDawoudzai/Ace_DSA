package db

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
)

// Open connects to Postgres using DB_URL and pings to verify. Returns nil if DB_URL is empty.
func Open() (*sql.DB, error) {
	url := os.Getenv("DB_URL")
	if url == "" {
		log.Print("DB_URL not set, running without database")
		return nil, nil
	}

	db, err := sql.Open("pgx", url)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		db.Close()
		return nil, err
	}

	log.Print("database connected")
	return db, nil
}
