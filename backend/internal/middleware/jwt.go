package middleware

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserIDKey contextKey = "user_id"

func JWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
			http.Error(w, "missing or invalid authorization header", http.StatusUnauthorized)
			return
		}
		tokenStr := strings.TrimPrefix(auth, "Bearer ")

		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			http.Error(w, "server misconfigured", http.StatusInternalServerError)
			return
		}

		token, err := jwt.ParseWithClaims(tokenStr, &claims{}, func(t *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})
		if err != nil {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}
		c, ok := token.Claims.(*claims)
		if !ok || !token.Valid {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, c.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

type claims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

// OptionalJWT extracts user_id from a Bearer token if present but does not
// block unauthenticated requests. Useful for endpoints that return extra
// per-user data when logged in.
func OptionalJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth != "" && strings.HasPrefix(auth, "Bearer ") {
			tokenStr := strings.TrimPrefix(auth, "Bearer ")
			secret := os.Getenv("JWT_SECRET")
			if secret != "" {
				token, err := jwt.ParseWithClaims(tokenStr, &claims{}, func(t *jwt.Token) (interface{}, error) {
					return []byte(secret), nil
				})
				if err == nil {
					if c, ok := token.Claims.(*claims); ok && token.Valid {
						ctx := context.WithValue(r.Context(), UserIDKey, c.UserID)
						next.ServeHTTP(w, r.WithContext(ctx))
						return
					}
				}
			}
		}
		next.ServeHTTP(w, r)
	})
}
