# Ace DSA

**The idea.** Ace DSA helps you practice Data Structures & Algorithms the way they show up in interviews: by recognizing patterns and choosing the right approach. You work through common LeetCode-style problems with multiple-choice answers (or the in-app tutor)—no typing code required.

**Why we built it.** We wanted to study DSA when we're not at a desk: on the bus, commuting, or out somewhere without a laptop. The hard part isn't writing code; it's knowing which pattern or algorithm fits. Ace DSA lets you drill that anywhere.

---

## Quick start

```bash
docker compose up -d
curl http://localhost:8080/health   # ok
```

See [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) for full setup.

---

## Tech

| Area | Technologies |
|------|--------------|
| **iOS** | Swift, SwiftUI, Xcode |
| **Backend** | Go 1.26, standard library HTTP |
| **Database** | PostgreSQL (pgx driver) |
| **Auth** | JWT (access + refresh tokens) |
| **Dev / ops** | Docker, Docker Compose, GitHub Actions |
| **Infra (later)** | AWS, Terraform |
| **In-app tutor (later)** | LLM API, prompt-engineered DSA tutor |

---

## Repo structure

```
ace-dsa/
├── ios/                    # SwiftUI app (create Xcode project here)
├── backend/
│   ├── cmd/api/            # API entrypoint
│   ├── internal/
│   │   ├── auth/           # Email + password, JWT
│   │   ├── middleware/     # Logging, CORS, JWT auth
│   │   ├── db/             # Postgres connection + migrations
│   │   ├── drills/         # Drill feed, pattern + choices
│   │   ├── attempts/       # User drill submissions
│   │   └── stats/          # Per-pattern performance, streak
│   └── migrations/         # SQL (see internal/db/migrations for embedded)
├── infra/                  # AWS / Terraform (later)
├── docs/                   # GETTING_STARTED, design notes
└── .github/workflows/      # CI (Go test, gofmt)
```

---

## Status

| Done | Next |
|------|------|
| Backend server, /health, / | Drills API (GET /drills) |
| Postgres + migrations (users, drills, attempts) | Attempts API (POST /attempts) |
| Docker (backend + Postgres) | Stats API (GET /me/stats) |
| CI (test, gofmt) | iOS app (Xcode project in ios/) |
| Auth (signup, login, refresh, JWT) | |

---

## Prerequisites

- **Docker** (easiest): Docker Desktop or Docker Engine + Compose.
- **Or** Go 1.26+ if you want to run the backend without Docker.
- **iOS:** Xcode and Swift 5; create the app in `ios/`.

## Local run

### Option A: Docker (backend + Postgres)

From repo root:

```bash
docker compose up -d
```

- API: **http://localhost:8080** (health: `GET /health`, info: `GET /`)
- Postgres: **localhost:5432**, user `acedsa`, password `acedsa`, database `acedsa`

Stop:

```bash
docker compose down
```

### Option B: Backend only (no Docker)

From repo root:

```bash
# Copy env template and set values (no secrets in repo)
cp backend/.env.example backend/.env

# Run API (default :8080)
make backend-run
# or: cd backend && go run ./cmd/api
```

Verify:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/
```

### Tests & format

```bash
make backend-test   # go test ./...
make fmt            # gofmt backend
```

## iOS

1. In Xcode: **File → New → Project → App** (SwiftUI).
2. Product name: **AceDSA**. Save inside `ios/`.
3. Build and run from Xcode.

## CI

On push and PRs to `main`, GitHub Actions runs Go tests and gofmt in `backend/` (`.github/workflows/backend-ci.yml`).

## Setup outside the repo

- **Go:** [go.dev/dl](https://go.dev/dl/) — add to PATH; restart your terminal or IDE after installing.
- **Docker:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) — start the engine before `docker compose up`.
- **Secrets:** Don’t commit `.env`. Use `backend/.env.example` as a template.

## License

MIT — see [LICENSE](LICENSE).
