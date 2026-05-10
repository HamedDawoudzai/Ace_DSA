package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"
	"runtime"
	"sync/atomic"
	"time"
)

// Metrics collects basic request metrics (no external dependencies).
type Metrics struct {
	requestCount  atomic.Int64
	errorCount    atomic.Int64
	totalDuration atomic.Int64 // nanoseconds
	startTime     time.Time
}

func NewMetrics() *Metrics {
	return &Metrics{startTime: time.Now()}
}

func (m *Metrics) Wrap(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rec := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(rec, r)
		dur := time.Since(start)

		m.requestCount.Add(1)
		m.totalDuration.Add(int64(dur))
		if rec.status >= 500 {
			m.errorCount.Add(1)
		}
	})
}

// Handler returns a Prometheus-compatible text exposition of basic metrics.
func (m *Metrics) Handler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var mem runtime.MemStats
		runtime.ReadMemStats(&mem)

		reqs := m.requestCount.Load()
		errs := m.errorCount.Load()
		totalNs := m.totalDuration.Load()
		uptime := time.Since(m.startTime).Seconds()

		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		fmt.Fprintf(w, "# HELP acedsa_requests_total Total HTTP requests.\n")
		fmt.Fprintf(w, "# TYPE acedsa_requests_total counter\n")
		fmt.Fprintf(w, "acedsa_requests_total %d\n", reqs)
		fmt.Fprintf(w, "# HELP acedsa_errors_total Total 5xx responses.\n")
		fmt.Fprintf(w, "# TYPE acedsa_errors_total counter\n")
		fmt.Fprintf(w, "acedsa_errors_total %d\n", errs)
		fmt.Fprintf(w, "# HELP acedsa_request_duration_seconds_total Total request duration.\n")
		fmt.Fprintf(w, "# TYPE acedsa_request_duration_seconds_total counter\n")
		fmt.Fprintf(w, "acedsa_request_duration_seconds_total %.6f\n", float64(totalNs)/1e9)
		fmt.Fprintf(w, "# HELP acedsa_uptime_seconds Server uptime.\n")
		fmt.Fprintf(w, "# TYPE acedsa_uptime_seconds gauge\n")
		fmt.Fprintf(w, "acedsa_uptime_seconds %.2f\n", uptime)
		fmt.Fprintf(w, "# HELP acedsa_goroutines Active goroutines.\n")
		fmt.Fprintf(w, "# TYPE acedsa_goroutines gauge\n")
		fmt.Fprintf(w, "acedsa_goroutines %d\n", runtime.NumGoroutine())
		fmt.Fprintf(w, "# HELP acedsa_memory_alloc_bytes Current memory allocation.\n")
		fmt.Fprintf(w, "# TYPE acedsa_memory_alloc_bytes gauge\n")
		fmt.Fprintf(w, "acedsa_memory_alloc_bytes %d\n", mem.Alloc)
	}
}

// JSONHandler returns metrics as JSON for simpler consumption.
func (m *Metrics) JSONHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var mem runtime.MemStats
		runtime.ReadMemStats(&mem)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"requests_total":     m.requestCount.Load(),
			"errors_total":       m.errorCount.Load(),
			"uptime_seconds":     time.Since(m.startTime).Seconds(),
			"goroutines":         runtime.NumGoroutine(),
			"memory_alloc_bytes": mem.Alloc,
		})
	}
}
