package main

import (
	"bufio"
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/HamedDawoudzai/ace-dsa/backend/internal/attempts"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/auth"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/db"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/drills"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/middleware"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/stats"
)

// loadDotEnv reads backend/.env and sets any unset environment variables.
// Real environment variables always take precedence. Silently skips if no file.
func loadDotEnv() {
	f, err := os.Open(".env")
	if err != nil {
		return
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		key := strings.TrimSpace(parts[0])
		val := strings.TrimSpace(parts[1])
		if key == "" {
			continue
		}
		// Only set if the variable isn't already set in the environment.
		if os.Getenv(key) == "" {
			os.Setenv(key, val)
		}
	}
}

func main() {
	loadDotEnv()

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
	mux.HandleFunc("/readyz", readyHandler(database))
	mux.HandleFunc("/", rootHandler)
	mux.HandleFunc("/auth/signup", authHandler.Signup)
	mux.HandleFunc("/auth/login", authHandler.Login)
	mux.HandleFunc("/auth/refresh", authHandler.Refresh)
	mux.HandleFunc("/drills", drillsHandler.List)
	mux.HandleFunc("/drills/", drillsHandler.GetByID)
	mux.Handle("/attempts", middleware.JWT(http.HandlerFunc(attemptsHandler.Create)))
	mux.Handle("/me/attempts", middleware.JWT(http.HandlerFunc(attemptsHandler.List)))
	mux.Handle("/me/stats", middleware.JWT(http.HandlerFunc(statsHandler.Get)))

	server := &http.Server{
		Addr:         addr,
		Handler: middleware.CORS(
			middleware.RequestID(
				middleware.Recover(
					middleware.RateLimit(middleware.RateLimitOptions{Requests: 240, Window: time.Minute})(
						middleware.Logging(mux),
					),
				),
			),
		),
		ReadTimeout:  10 * time.Second,
		ReadHeaderTimeout: 5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Printf("ace-dsa-api listening on %s", addr)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server: %v", err)
		}
	}()

	<-quit
	log.Print("shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("shutdown: %v", err)
	}
	log.Print("server stopped")
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}

func readyHandler(database *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		if database == nil {
			http.Error(w, "database unavailable", http.StatusServiceUnavailable)
			return
		}
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()
		if err := database.PingContext(ctx); err != nil {
			http.Error(w, "database unavailable", http.StatusServiceUnavailable)
			return
		}
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ready"))
	}
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"service": "ace-dsa-api",
		"version": "0.1.0",
		"status":  "running",
	})
}
