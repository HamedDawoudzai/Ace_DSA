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
├── ios/
│   └── AceDSA/             # SwiftUI source files (add to Xcode project)
│       ├── AceDSAApp.swift  # @main entry point
│       ├── ContentView.swift# Auth gate → tab bar
│       ├── Networking/
│       │   ├── APIClient.swift   # URLSession wrapper (JWT, snake_case coding)
│       │   └── Endpoints.swift   # Typed API endpoints
│       ├── Models/
│       │   ├── AuthModels.swift  # SignupRequest, LoginRequest, TokenResponse
│       │   ├── Drill.swift       # Drill model (matches backend JSON)
│       │   └── Attempt.swift     # AttemptRequest / AttemptResponse
│       ├── Store/
│       │   └── AuthStore.swift   # ObservableObject auth state
│       └── Views/
│           ├── Auth/AuthView.swift          # Login / Sign Up screen
│           ├── Drills/DrillsView.swift      # Drill list feed
│           ├── Drills/DrillDetailView.swift # Drill choices + submit
│           └── Stats/StatsView.swift        # Placeholder stats screen
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
| Backend server, /health, / | Auth (signup, login, JWT) |
| Postgres + migrations (users, drills, attempts) | Drills API (GET /drills) |
| Docker (backend + Postgres) | Attempts API (POST /attempts) |
| CI (test, gofmt) | Stats API (GET /me/stats) |
| iOS SwiftUI source files in `ios/AceDSA/` | Xcode project (create & add source files) |

---

## Prerequisites

- **Docker** (easiest): Docker Desktop or Docker Engine + Compose.
- **Or** Go 1.26+ if you want to run the backend without Docker.
- **iOS:** Xcode 15+ and Swift 5.9+; iOS deployment target 17+.

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

The SwiftUI source files live in `ios/AceDSA/`. You need to create an Xcode project once and point it at them.

### One-time Xcode project setup

1. Open Xcode → **File → New → Project → App**.
2. Product name: **AceDSA**, Interface: **SwiftUI**, Language: **Swift**.
3. Save into `ios/` (Xcode creates `ios/AceDSA.xcodeproj`).
4. In the Xcode project navigator, right-click the `AceDSA` group → **Add Files to "AceDSA"…**
5. Select the `ios/AceDSA/` folder (check *Create groups*, uncheck *Copy items if needed*).
6. Delete the boilerplate `ContentView.swift` and `AceDSAApp.swift` Xcode generated — the repo versions replace them.

### Run

- Select a simulator (iPhone 16, iOS 17+) and press **⌘R**.
- The app starts at the auth screen. Make sure the backend is running (`docker compose up -d`) so API calls resolve.

### Physical device

Update `Endpoint.baseURL` in `ios/AceDSA/Networking/Endpoints.swift` from `localhost` to your Mac's local IP address (e.g. `http://192.168.1.x:8080`).

### Source layout

| File | Purpose |
|------|---------|
| `AceDSAApp.swift` | `@main` entry point; injects `AuthStore` |
| `ContentView.swift` | Auth gate: shows `AuthView` or the main tab bar |
| `Networking/APIClient.swift` | `URLSession` wrapper; handles JWT headers, snake_case decoding, error surfacing |
| `Networking/Endpoints.swift` | All API endpoint URLs in one place |
| `Models/` | `Drill`, `AttemptRequest/Response`, `TokenResponse` mirroring backend JSON |
| `Store/AuthStore.swift` | `ObservableObject` holding the access token; drives the auth gate |
| `Views/Auth/AuthView.swift` | Login / Sign Up (segmented picker, calls `/auth/login` or `/auth/signup`) |
| `Views/Drills/DrillsView.swift` | Drill list feed (`GET /drills`) with pull-to-refresh |
| `Views/Drills/DrillDetailView.swift` | Drill prompt, multiple-choice, submit (`POST /attempts`) |
| `Views/Stats/StatsView.swift` | Placeholder until Stats API is live |

## CI

On push and PRs to `main`, GitHub Actions runs Go tests and gofmt in `backend/` (`.github/workflows/backend-ci.yml`).

## Setup outside the repo

- **Go:** [go.dev/dl](https://go.dev/dl/) — add to PATH; restart your terminal or IDE after installing.
- **Docker:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) — start the engine before `docker compose up`.
- **Secrets:** Don’t commit `.env`. Use `backend/.env.example` as a template.

## License

MIT — see [LICENSE](LICENSE).
