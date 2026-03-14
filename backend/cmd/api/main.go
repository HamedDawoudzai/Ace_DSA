```1:91:backend/cmd/api/main.go
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/HamedDawoudzai/ace-dsa/backend/internal/auth"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/attempts"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/db"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/drills"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/middleware"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/stats"
)

func main() {
	database, err := db.Open()
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	if database != nil {
		defer database.Close()
		if err := db.Migrate(database); err != nil {
			log.Fatalf("migrate: %v", err)
		}
	}

	authHandler := &auth.Handler{DB: database}
	drillsHandler := &drills.Handler{DB: database}
	attemptsHandler := &attempts.Handler{DB: database}
	statsHandler := &stats.Handler{DB: database}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/", rootHandler)
	mux.HandleFunc("/auth/signup", authHandler.Signup)
	mux.HandleFunc("/auth/login", authHandler.Login)
	mux.HandleFunc("/auth/refresh", authHandler.Refresh)
	mux.HandleFunc("/drills", drillsHandler.List)
	mux.Handle("/attempts", middleware.JWT(http.HandlerFunc(attemptsHandler.Create)))
	mux.Handle("/me/attempts", middleware.JWT(http.HandlerFunc(attemptsHandler.List)))
	mux.Handle("/me/stats", middleware.JWT(http.HandlerFunc(statsHandler.Get)))
// ... rest of file ...
```

The `GET /me/attempts` route has been registered in the ServeMux, protected behind `middleware.JWT`, and wired to `attemptsHandler.List`.
