package middleware

import (
	"net"
	"net/http"
	"sync"
	"time"
)

type RateLimitOptions struct {
	Requests    int
	Window      time.Duration
	CleanupFreq time.Duration
}

type ipWindow struct {
	start time.Time
	n     int
}

func RateLimit(opts RateLimitOptions) func(http.Handler) http.Handler {
	if opts.Requests <= 0 {
		opts.Requests = 120
	}
	if opts.Window <= 0 {
		opts.Window = time.Minute
	}
	if opts.CleanupFreq <= 0 {
		opts.CleanupFreq = 5 * time.Minute
	}

	var (
		mu   sync.Mutex
		ip2w = map[string]*ipWindow{}
	)

	go func() {
		ticker := time.NewTicker(opts.CleanupFreq)
		defer ticker.Stop()
		for range ticker.C {
			now := time.Now()
			mu.Lock()
			for ip, win := range ip2w {
				if now.Sub(win.start) > opts.Window*2 {
					delete(ip2w, ip)
				}
			}
			mu.Unlock()
		}
	}()

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := clientIP(r)
			now := time.Now()

			mu.Lock()
			win, ok := ip2w[ip]
			if !ok {
				win = &ipWindow{start: now, n: 0}
				ip2w[ip] = win
			}
			if now.Sub(win.start) >= opts.Window {
				win.start = now
				win.n = 0
			}
			win.n++
			allowed := win.n <= opts.Requests
			mu.Unlock()

			if !allowed {
				w.Header().Set("Retry-After", "60")
				http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		if parts := net.ParseIP(xff); parts != nil {
			return parts.String()
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err == nil && host != "" {
		return host
	}
	return r.RemoteAddr
}
