package auth

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"
	"unicode"

	"github.com/HamedDawoudzai/ace-dsa/backend/internal/email"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// LoginLimiter tracks failed login attempts for brute-force protection.
type LoginLimiter interface {
	Check(identifier string) bool
	RecordFailure(identifier string)
	RecordSuccess(identifier string)
}

type Handler struct {
	DB           *sql.DB
	LoginLimiter LoginLimiter
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

type forgotPasswordReq struct {
	Email string `json:"email"`
}

type resetPasswordReq struct {
	Token       string `json:"token"`
	NewPassword string `json:"new_password"`
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

	verifyTokenBytes := make([]byte, 32)
	rand.Read(verifyTokenBytes)
	verifyToken := hex.EncodeToString(verifyTokenBytes)
	verifyExpires := time.Now().Add(24 * time.Hour)

	var id string
	err = h.DB.QueryRow(
		`INSERT INTO users (email, password_hash, first_name, last_name, username,
		                     email_verify_token, email_verify_expires)
		 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
		req.Email, string(hash), req.FirstName, req.LastName, req.Username,
		verifyToken, verifyExpires,
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

	if err := email.SendEmailVerification(req.Email, verifyToken); err != nil {
		log.Printf("failed to send verification email to %s: %v", req.Email, err)
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

	if h.LoginLimiter != nil && h.LoginLimiter.Check(req.Identifier) {
		w.Header().Set("Retry-After", "900")
		http.Error(w, "too many failed login attempts, try again later", http.StatusTooManyRequests)
		return
	}

	var id, hash string
	err := h.DB.QueryRow(
		`SELECT id, password_hash FROM users WHERE email = $1 OR username = $1`,
		req.Identifier,
	).Scan(&id, &hash)
	if err == sql.ErrNoRows {
		if h.LoginLimiter != nil {
			h.LoginLimiter.RecordFailure(req.Identifier)
		}
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)); err != nil {
		if h.LoginLimiter != nil {
			h.LoginLimiter.RecordFailure(req.Identifier)
		}
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	if h.LoginLimiter != nil {
		h.LoginLimiter.RecordSuccess(req.Identifier)
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
		return nil, errMissingJWTSecret
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

var errMissingJWTSecret = &configError{msg: "JWT_SECRET is required"}

type configError struct{ msg string }

func (e *configError) Error() string { return e.msg }

func parseRefreshToken(tokenStr string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", errMissingJWTSecret
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

func (h *Handler) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req forgotPasswordReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" {
		http.Error(w, "email required", http.StatusBadRequest)
		return
	}
	if h.DB == nil {
		http.Error(w, "database unavailable", http.StatusServiceUnavailable)
		return
	}

	tokenBytes := make([]byte, 32)
	rand.Read(tokenBytes)
	token := hex.EncodeToString(tokenBytes)
	expires := time.Now().Add(1 * time.Hour)

	res, err := h.DB.Exec(
		`UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE email = $3`,
		token, expires, req.Email,
	)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	if n, _ := res.RowsAffected(); n > 0 {
		if err := email.SendPasswordReset(req.Email, token); err != nil {
			log.Printf("failed to send password reset email to %s: %v", req.Email, err)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "if that email exists, a reset link has been sent",
	})
}

func (h *Handler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req resetPasswordReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	if req.Token == "" || req.NewPassword == "" {
		http.Error(w, "token and new_password required", http.StatusBadRequest)
		return
	}
	if msg := validatePassword(req.NewPassword); msg != "" {
		http.Error(w, msg, http.StatusBadRequest)
		return
	}
	if h.DB == nil {
		http.Error(w, "database unavailable", http.StatusServiceUnavailable)
		return
	}

	var uid string
	err := h.DB.QueryRow(
		`SELECT id FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()`,
		req.Token,
	).Scan(&uid)
	if err == sql.ErrNoRows {
		http.Error(w, "invalid or expired reset token", http.StatusBadRequest)
		return
	}
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	h.DB.Exec(
		`UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL, updated_at = NOW() WHERE id = $2`,
		string(hash), uid,
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "password reset successful"})
}

func (h *Handler) VerifyEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		Token string `json:"token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	if req.Token == "" {
		http.Error(w, "token required", http.StatusBadRequest)
		return
	}
	if h.DB == nil {
		http.Error(w, "database unavailable", http.StatusServiceUnavailable)
		return
	}

	res, err := h.DB.Exec(
		`UPDATE users SET email_verified = true,
		                  email_verify_token = NULL,
		                  email_verify_expires = NULL,
		                  updated_at = NOW()
		 WHERE email_verify_token = $1 AND email_verify_expires > NOW()`,
		req.Token,
	)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	if n, _ := res.RowsAffected(); n == 0 {
		http.Error(w, "invalid or expired verification token", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "email verified"})
}
