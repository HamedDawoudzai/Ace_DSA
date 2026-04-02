# Ace DSA

**The idea.** Ace DSA helps you practice Data Structures & Algorithms the way they show up in interviews: by recognizing patterns and choosing the right approach. You work through common LeetCode-style problems with multiple-choice answers, no typing code required.

**Why we built it.** We wanted to study DSA when we're not at a desk: on the bus, commuting, or out somewhere without a laptop. The hard part isn't writing code; it's knowing which pattern or algorithm fits. Ace DSA lets you drill that anywhere.

---

## Quick start

```bash
# Backend (needs PostgreSQL — see docs/GETTING_STARTED.md)
cp backend/.env.example backend/.env   # set DB_URL and JWT_SECRET
make backend-run
curl http://localhost:8080/health   # ok

# Mobile
cd mobile
npm install
npx expo start
```

See [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) for full setup.

---

## Tech

| Area | Technologies |
|------|--------------|
| **Mobile** | React Native, Expo (SDK 54), TypeScript |
| **Backend** | Go 1.26, standard library HTTP |
| **Database** | PostgreSQL (pgx driver); [Supabase](https://supabase.com) compatible |
| **Auth** | JWT (access + refresh tokens) |
| **Dev / ops** | Make, GitHub Actions |
| **Infra (later)** | AWS, Terraform |
| **In-app tutor (later)** | LLM API, prompt-engineered DSA tutor |

---

## Repo structure

```
ace-dsa/
├── mobile/                   # React Native (Expo) app
│   ├── App.tsx               # Entry point
│   ├── src/
│   │   ├── types/            # TypeScript interfaces matching backend JSON
│   │   ├── services/         # Axios API client, JWT interceptor, storage
│   │   ├── context/          # AuthContext (login, signup, signout, token restore)
│   │   ├── navigation/       # RootNavigator, AuthStack, MainTabs
│   │   ├── screens/          # AuthScreen, HomeScreen, DrillsScreen, etc.
│   │   └── components/       # Reusable UI (HomeCard)
│   └── package.json
├── backend/
│   ├── cmd/api/              # API entrypoint
│   ├── internal/
│   │   ├── auth/             # Email + password, JWT
│   │   ├── middleware/       # Logging, CORS, JWT auth
│   │   ├── db/               # Postgres connection + migrations
│   │   ├── drills/           # Drill feed, pattern + choices
│   │   ├── attempts/         # User drill submissions
│   │   └── stats/            # Per-pattern performance, streak
│   └── migrations/           # SQL (see internal/db/migrations for embedded)
├── infra/                    # AWS / Terraform (later)
├── docs/                     # GETTING_STARTED, design notes
└── .github/workflows/        # CI (Go test, gofmt, go vet)
```

---

## Status

| Done | Next |
|------|------|
| Backend API (health, auth, drills, attempts, stats) | Seed drills data |
| Postgres + migrations (users, drills, attempts) | LLM tutor integration |
| Local Postgres + `go run` | AWS / Terraform deployment |
| CI (test, gofmt, go vet) | |
| Auth (signup, login, refresh, JWT) | |
| React Native app (Expo SDK 54) | |
| Auth flow, drill list, drill detail, stats | |
| CORS, request logging, graceful shutdown | |

---

## Prerequisites

- **Node.js** 20.19.4 or newer (required by Expo SDK 54)
- **Go** 1.26+ and **PostgreSQL** (local install or managed host e.g. Supabase)
- **Expo Go** app on your phone (iOS App Store or Android Play Store) for mobile testing

---

## Local run

### Backend

Use **[Supabase](https://supabase.com)** (hosted Postgres) or a **local Postgres** — see [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md). Set `DB_URL` to the Supabase **URI** from the dashboard (with `sslmode=require`), or to a local connection string.

```bash
cp backend/.env.example backend/.env
# Edit backend/.env: DB_URL, JWT_SECRET, PORT

make backend-run
# or: cd backend && go run ./cmd/api
```

- API: **http://localhost:8080** (health: `GET /health`, info: `GET /`)

### Mobile app

```bash
cd mobile
npm install
npx expo start
```

Then:

- Press **w** to open in your web browser
- Scan the QR code with **Expo Go** on your phone (phone and PC must be on the same Wi-Fi)
- Press **a** for Android emulator or **i** for iOS simulator

**Important:** If testing on a phone or emulator, update `BASE_URL` in `mobile/src/services/api.ts` from `http://localhost:8080` to your machine's LAN IP (e.g. `http://192.168.1.x:8080`).

### Tests and format

```bash
make backend-test    # go test ./...
make backend-build   # compile binary
make fmt             # gofmt backend
```

---

## API endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Health check |
| `GET` | `/` | No | Service info + version |
| `POST` | `/auth/signup` | No | Create user, return tokens |
| `POST` | `/auth/login` | No | Login, return tokens |
| `POST` | `/auth/refresh` | No | Refresh access token |
| `GET` | `/drills` | No | List all drills |
| `GET` | `/drills/{id}` | No | Get single drill |
| `POST` | `/attempts` | JWT | Submit drill attempt |
| `GET` | `/me/attempts` | JWT | List user attempts |
| `GET` | `/me/stats` | JWT | User stats by pattern + streak |

---

## CI

On push and PRs to `main`, GitHub Actions runs Go tests, go vet, and gofmt in `backend/` (`.github/workflows/backend-ci.yml`).

## Setup outside the repo

- **Node.js:** [nodejs.org/en/download](https://nodejs.org/en/download/) - version 20.19.4 or newer required
- **Go:** [go.dev/dl](https://go.dev/dl/) - add to PATH; restart your terminal or IDE after installing
- **PostgreSQL:** [postgresql.org/download](https://www.postgresql.org/download/) — or use a hosted DB URL in `DB_URL`
- **Expo Go:** Install from the App Store (iOS) or Play Store (Android) for on-device testing
- **Secrets:** Don't commit `.env`. Use `backend/.env.example` as a template

## License

MIT - see [LICENSE](LICENSE).
