package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/HamedDawoudzai/ace-dsa/backend/internal/attempts"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/auth"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/db"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/drills"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/middleware"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/profile"
	"github.com/HamedDawoudzai/ace-dsa/backend/internal/stats"
)

var version = "1.0.0"

func main() {
	migrateOnly := flag.Bool("migrate-only", false, "Run migrations and exit")
	flag.Parse()

	db.LoadDotEnv()

	if errs := validateEnv(); len(errs) > 0 {
		for _, e := range errs {
			log.Printf("CONFIG ERROR: %s", e)
		}
		log.Fatal("server cannot start — fix the configuration errors above")
	}

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

	if *migrateOnly {
		log.Print("migrations complete, exiting (--migrate-only)")
		return
	}

	loginLimiter := middleware.NewLoginLimiter(middleware.LoginLimiterOptions{
		MaxAttempts: 5,
		LockoutDur:  15 * time.Minute,
	})

	authHandler := &auth.Handler{DB: database, LoginLimiter: loginLimiter}
	drillsHandler := &drills.Handler{DB: database}
	attemptsHandler := &attempts.Handler{DB: database}
	statsHandler := &stats.Handler{DB: database}
	profileHandler := &profile.Handler{DB: database}

	metrics := middleware.NewMetrics()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/readyz", readyHandler(database))
	mux.HandleFunc("/metrics", metrics.Handler())
	mux.HandleFunc("/", rootHandler)
	mux.HandleFunc("/auth/signup", authHandler.Signup)
	mux.Handle("/auth/login", loginLimiter.Middleware(http.HandlerFunc(authHandler.Login)))
	mux.HandleFunc("/auth/refresh", authHandler.Refresh)
	mux.HandleFunc("/auth/forgot-password", authHandler.ForgotPassword)
	mux.HandleFunc("/auth/reset-password", authHandler.ResetPassword)
	mux.HandleFunc("/auth/verify-email", authHandler.VerifyEmail)
	mux.HandleFunc("/drills", drillsHandler.List)
	mux.HandleFunc("/drills/", drillsHandler.GetByID)
	mux.Handle("/drills/categories", middleware.OptionalJWT(http.HandlerFunc(drillsHandler.Categories)))
	mux.Handle("/attempts", middleware.JWT(http.HandlerFunc(attemptsHandler.Create)))
	mux.Handle("/me/attempts", middleware.JWT(http.HandlerFunc(attemptsHandler.List)))
	mux.Handle("/me/stats", middleware.JWT(http.HandlerFunc(statsHandler.Get)))
	mux.Handle("/me/stats/reset", middleware.JWT(http.HandlerFunc(statsHandler.Reset)))
	mux.Handle("/me/progress", middleware.JWT(http.HandlerFunc(profileHandler.Progress)))
	mux.Handle("/me/profile", middleware.JWT(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			profileHandler.Get(w, r)
		case http.MethodPut:
			profileHandler.Update(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})))
	mux.Handle("/me/password", middleware.JWT(http.HandlerFunc(profileHandler.ChangePassword)))
	mux.Handle("/me/account", middleware.JWT(http.HandlerFunc(profileHandler.Delete)))

	handler := middleware.CORS(
		middleware.RequestID(
			middleware.Recover(
				middleware.BodyLimit(1 << 20)(
					middleware.RateLimit(middleware.RateLimitOptions{Requests: 240, Window: time.Minute})(
						metrics.Wrap(
							middleware.Logging(mux),
						),
					),
				),
			),
		),
	)

	server := &http.Server{
		Addr:              addr,
		Handler:           handler,
		ReadTimeout:       10 * time.Second,
		ReadHeaderTimeout: 5 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    1 << 20,
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Printf("ace-dsa-api v%s listening on %s", version, addr)
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

func validateEnv() []string {
	var errs []string

	if os.Getenv("DB_URL") == "" {
		errs = append(errs, "DB_URL is required")
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		errs = append(errs, "JWT_SECRET is required")
	} else if len(secret) < 32 {
		errs = append(errs, fmt.Sprintf("JWT_SECRET must be at least 32 characters (got %d)", len(secret)))
	}

	return errs
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
		"version": version,
		"status":  "running",
	})
}
