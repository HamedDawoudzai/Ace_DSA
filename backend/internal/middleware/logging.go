package middleware

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"
)

type statusRecorder struct {
	http.ResponseWriter
	status int
}

func (r *statusRecorder) WriteHeader(code int) {
	r.status = code
	r.ResponseWriter.WriteHeader(code)
}

var useJSON = os.Getenv("LOG_FORMAT") == "json"

func Logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rec := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(rec, r)
		dur := time.Since(start)
		reqID := GetRequestID(r.Context())

		if useJSON {
			entry := map[string]interface{}{
				"level":       levelForStatus(rec.status),
				"method":      r.Method,
				"path":        r.URL.Path,
				"status":      rec.status,
				"duration_ms": dur.Milliseconds(),
				"request_id":  reqID,
				"remote_ip":   clientIP(r),
				"ts":          time.Now().UTC().Format(time.RFC3339),
			}
			b, _ := json.Marshal(entry)
			os.Stdout.Write(append(b, '\n'))
		} else {
			log.Printf("%s %s %d %s request_id=%s", r.Method, r.URL.Path, rec.status, dur, reqID)
		}
	})
}

func levelForStatus(status int) string {
	switch {
	case status >= 500:
		return "error"
	case status >= 400:
		return "warn"
	default:
		return "info"
	}
}
