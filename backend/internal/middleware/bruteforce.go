package middleware

import (
	"net/http"
	"sync"
	"time"
)

type LoginLimiterOptions struct {
	MaxAttempts int
	LockoutDur  time.Duration
	CleanupFreq time.Duration
}

type loginEntry struct {
	attempts int
	lockedAt time.Time
}

type LoginLimiter struct {
	mu      sync.Mutex
	entries map[string]*loginEntry
	opts    LoginLimiterOptions
}

func NewLoginLimiter(opts LoginLimiterOptions) *LoginLimiter {
	if opts.MaxAttempts <= 0 {
		opts.MaxAttempts = 5
	}
	if opts.LockoutDur <= 0 {
		opts.LockoutDur = 15 * time.Minute
	}
	if opts.CleanupFreq <= 0 {
		opts.CleanupFreq = 5 * time.Minute
	}

	ll := &LoginLimiter{
		entries: make(map[string]*loginEntry),
		opts:    opts,
	}

	go ll.cleanupLoop()
	return ll
}

func (ll *LoginLimiter) cleanupLoop() {
	ticker := time.NewTicker(ll.opts.CleanupFreq)
	defer ticker.Stop()
	for range ticker.C {
		now := time.Now()
		ll.mu.Lock()
		for key, e := range ll.entries {
			if !e.lockedAt.IsZero() && now.Sub(e.lockedAt) > ll.opts.LockoutDur {
				delete(ll.entries, key)
			}
		}
		ll.mu.Unlock()
	}
}

// Check returns true if the identifier is currently locked out.
func (ll *LoginLimiter) Check(identifier string) bool {
	ll.mu.Lock()
	defer ll.mu.Unlock()

	e, ok := ll.entries[identifier]
	if !ok {
		return false
	}
	if !e.lockedAt.IsZero() {
		if time.Since(e.lockedAt) > ll.opts.LockoutDur {
			delete(ll.entries, identifier)
			return false
		}
		return true
	}
	return false
}

// RecordFailure increments the failed attempt count and locks the account if threshold is reached.
func (ll *LoginLimiter) RecordFailure(identifier string) {
	ll.mu.Lock()
	defer ll.mu.Unlock()

	e, ok := ll.entries[identifier]
	if !ok {
		e = &loginEntry{}
		ll.entries[identifier] = e
	}
	e.attempts++
	if e.attempts >= ll.opts.MaxAttempts {
		e.lockedAt = time.Now()
	}
}

// RecordSuccess clears the entry for a successful login.
func (ll *LoginLimiter) RecordSuccess(identifier string) {
	ll.mu.Lock()
	defer ll.mu.Unlock()
	delete(ll.entries, identifier)
}

// Middleware wraps a login endpoint with brute-force protection.
func (ll *LoginLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := clientIP(r)
		if ll.Check(ip) {
			w.Header().Set("Retry-After", "900")
			http.Error(w, "too many failed login attempts, try again later", http.StatusTooManyRequests)
			return
		}
		next.ServeHTTP(w, r)
	})
}
