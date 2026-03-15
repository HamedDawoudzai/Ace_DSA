package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
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
	mux.HandleFunc("/drills/", drillsHandler.GetByID)
	mux.Handle("/attempts", middleware.JWT(http.HandlerFunc(attemptsHandler.Create)))
	mux.Handle("/me/attempts", middleware.JWT(http.HandlerFunc(attemptsHandler.List)))
	mux.Handle("/me/stats", middleware.JWT(http.HandlerFunc(statsHandler.Get)))

	server := &http.Server{
		Addr:         addr,
		Handler:      middleware.CORS(middleware.Logging(mux)),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
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
