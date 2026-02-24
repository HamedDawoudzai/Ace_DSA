package db

import (
	"database/sql"
	"embed"
	"log"
	"sort"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

// Migrate runs all embedded SQL migrations in order. Safe to call on every startup (schema uses IF NOT EXISTS).
func Migrate(db *sql.DB) error {
	if db == nil {
		return nil
	}

	entries, err := migrationsFS.ReadDir("migrations")
	if err != nil {
		return err
	}

	names := make([]string, 0, len(entries))
	for _, e := range entries {
		if !e.IsDir() && len(e.Name()) > 4 && e.Name()[len(e.Name())-4:] == ".sql" {
			names = append(names, e.Name())
		}
	}
	sort.Strings(names)

	for _, name := range names {
		body, err := migrationsFS.ReadFile("migrations/" + name)
		if err != nil {
			return err
		}
		if _, err := db.Exec(string(body)); err != nil {
			return err
		}
		log.Printf("migration applied: %s", name)
	}

	return nil
}
