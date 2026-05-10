# Ace DSA — Deployment Guide

## Architecture

```
Mobile App (Expo)  -->  Go API  -->  PostgreSQL
                        :8080
```

## Quick Start (Docker)

```bash
# From repo root:
docker compose up -d

# API is now at http://localhost:8080
# Postgres is at localhost:5432 (user: acedsa, pass: acedsa)

# Seed drill data:
make seed
```

## Backend Deployment

### Recommended Platforms

| Platform | Pros | Setup |
|----------|------|-------|
| **Railway** | Built-in Postgres, auto-deploy from GitHub | Connect repo, set env vars |
| **Fly.io** | Edge deployment, free tier | `fly launch`, attach Postgres |
| **Render** | Simple, free tier for web services | Connect repo, add Postgres |

### Environment Variables (Required)

| Variable | Description |
|----------|-------------|
| `DB_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Min 32 chars. Generate: `openssl rand -base64 64` |
| `PORT` | HTTP port (default `8080`) |
| `CORS_ORIGINS` | Comma-separated allowed origins |

### Environment Variables (Optional)

| Variable | Description |
|----------|-------------|
| `LOG_FORMAT` | Set to `json` for structured logging |
| `SMTP_HOST` | SMTP server for emails |
| `SMTP_PORT` | SMTP port (default `587`) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | Sender email address |
| `APP_URL` | Base URL for email links |
| `SENTRY_DSN` | Sentry error tracking DSN |

### Deploy Steps

1. **Provision a Postgres database** (Supabase, Railway, Neon, etc.)
2. **Set environment variables** on your platform
3. **Deploy the Docker image** or connect your GitHub repo
4. **Run migrations**: The API runs them on startup, or use `--migrate-only` flag:
   ```bash
   ace-dsa-api --migrate-only
   ```
5. **Seed data** (first deploy only):
   ```bash
   go run ./cmd/seed
   ```
6. **Verify**: `curl https://your-api.com/health` should return `ok`

### Health Checks

- `GET /health` — always returns `ok` if the process is running
- `GET /readyz` — returns `ready` only when the database is reachable
- `GET /metrics` — Prometheus-compatible metrics

## Mobile Deployment

### Prerequisites

- Expo account: https://expo.dev
- EAS CLI: `npm install -g eas-cli`
- Apple Developer account (iOS) / Google Play Console (Android)

### Setup

1. **Login**: `eas login`
2. **Configure project ID**: Update `YOUR_EAS_PROJECT_ID` in `mobile/app.json`
3. **Update bundle IDs** if needed in `app.json` (iOS `bundleIdentifier`, Android `package`)
4. **Set API URL** in `mobile/eas.json` per build profile

### Build & Submit

```bash
cd mobile

# Development build (for testing on device)
eas build --profile development --platform all

# Preview build (internal testing)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### OTA Updates

Push JavaScript updates without rebuilding:

```bash
eas update --branch production --message "Bug fix description"
```

## Monitoring

### Uptime Monitoring

Set up a free monitor at [UptimeRobot](https://uptimerobot.com) or [Checkly](https://www.checklyhq.com):

- **URL**: `https://your-api.com/health`
- **Interval**: 5 minutes
- **Alert**: Email/Slack on failure

### Metrics

The `/metrics` endpoint exposes:
- `acedsa_requests_total` — total HTTP requests
- `acedsa_errors_total` — total 5xx responses
- `acedsa_uptime_seconds` — server uptime
- `acedsa_goroutines` — active goroutines
- `acedsa_memory_alloc_bytes` — current memory usage

Connect to Prometheus/Grafana for dashboards, or use the JSON endpoint at `/metrics?format=json`.
