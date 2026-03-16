package middleware

import (
	"net"
	"net/http"
	"sync"
	"time"
)

type RateLimitOptions struct {
	// Requests allowed per IP within Window.
	Requests int
	Window   time.Duration
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

	var (
		mu   sync.Mutex
		ip2w = map[string]*ipWindow{}
	)

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
	// For now, trust direct connections only; behind a proxy, terminate and set
	// X-Forwarded-For then update this accordingly.
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err == nil && host != "" {
		return host
	}
	return r.RemoteAddr
}

