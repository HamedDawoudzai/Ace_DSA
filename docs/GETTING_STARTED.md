# How to start Ace DSA (for developers)

This guide gets the backend, database, and mobile app running locally.

## Prerequisites

- **Node.js** 20.19.4 or newer ([download](https://nodejs.org/en/download/))
- **Go** 1.26+ ([download](https://go.dev/dl/))
- **PostgreSQL** ([download](https://www.postgresql.org/download/)) or any Postgres-compatible URL (e.g. Supabase)
- **Expo Go** app on your phone (optional, for on-device testing)

Check your Node version:

```bash
node --version
# Must be >= 20.19.4
```

## 1. Clone and open the repo

```bash
git clone https://github.com/HamedDawoudzai/Ace_DSA.git
cd Ace_DSA
```

## 2. Start the backend and database

Copy the env template and set secrets:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with at least `DB_URL`, `JWT_SECRET`, and optionally `PORT`.

### Option A — Supabase (hosted Postgres)

1. Create a project at [supabase.com](https://supabase.com) and wait until the database is ready.

2. Open **Project Settings → Database** and find **Connection string** → **URI** (sometimes labeled “Direct connection” or “Session mode”).

3. Copy the URI, insert your **database password** where indicated, and set it as `DB_URL` in `backend/.env`.

   - Use a connection that supports **normal Postgres sessions** and **DDL** (this API runs SQL migrations when it starts). **Direct connection** or **Session pooler** is appropriate; **Transaction mode** (PgBouncer on port 6543) can interfere with migrations—if you only use transaction mode, run migrations against the DB another way or use direct/session for dev.

   - The URI must use **TLS**: include `sslmode=require` (Supabase’s copied string usually already does).

4. Run the API **on your machine** (`make backend-run`), not inside a container, so you avoid common **IPv6** routing issues to `db.*.supabase.co` from Docker on Windows.

### Option B — Local PostgreSQL

1. Install PostgreSQL and ensure the server is running.

2. Create a user and database (in `psql` or any client):

   ```sql
   CREATE USER acedsa WITH PASSWORD 'acedsa';
   CREATE DATABASE acedsa OWNER acedsa;
   ```

3. In `backend/.env`:

   ```env
   DB_URL=postgres://acedsa:acedsa@localhost:5432/acedsa?sslmode=disable
   JWT_SECRET=your-secret-at-least-32-characters-long
   PORT=8080
   ```

### Start the API

```bash
make backend-run
# or: cd backend && go run ./cmd/api
```

**Result:** API at http://localhost:8080. Migrations run on startup.

## 3. Check that the backend is running

```bash
curl http://localhost:8080/health
# should print: ok

curl http://localhost:8080/
# should print: {"service":"ace-dsa-api","status":"running","version":"0.1.0"}
```

### Auth endpoints

Signup and login return access and refresh tokens. Use the access token in the `Authorization: Bearer <token>` header for protected routes.

```bash
# Signup
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"yourpassword8"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"yourpassword8"}'

# Refresh tokens (use refresh_token from login/signup response)
curl -X POST http://localhost:8080/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"<your_refresh_token>"}'
```

## 4. Start the mobile app

```bash
cd mobile
npm install
npx expo start
```

Then choose how to view it:

- **Web browser:** Press **w** (opens http://localhost:8081)
- **Phone (Expo Go):** Scan the QR code in the terminal with the Expo Go app. Your phone and PC must be on the same Wi-Fi network.
- **Android emulator:** Press **a** (requires Android Studio with an AVD configured)
- **iOS simulator:** Press **i** (requires macOS with Xcode)

**Important for phone/emulator testing:** set `EXPO_PUBLIC_API_BASE_URL` (or `expo.extra.apiBaseUrl` in `mobile/app.json`) to your machine LAN IP, e.g. `http://192.168.1.x:8080`. `localhost` only works on the same machine.

## 5. Stop everything

- **API:** Press `Ctrl+C` in the terminal running `make backend-run`.
- **Expo:** Press `Ctrl+C` in the terminal running `npx expo start`.

## Troubleshooting

- **"Node.js is outdated and unsupported"**
  Update Node.js to 20.19.4 or newer from [nodejs.org](https://nodejs.org/en/download/).

- **"go: command not found"**
  Install Go and add it to your PATH, then close and reopen your terminal.

- **Backend exits with "database: ..."**
  Check `DB_URL` in `backend/.env`: correct password, and for **Supabase** use `sslmode=require`. For **“network is unreachable”** to Supabase, run the API on the host (not in Docker) or switch to a connection string that resolves over IPv4 (e.g. **Session** pooler vs direct host, per Supabase docs).

- **Migrations fail against Supabase**
  Prefer **Direct** or **Session** connection strings for this API. **Transaction** pooler (port 6543) can block some DDL; use a non-transaction URI for dev, or apply migrations with `psql` / Supabase SQL editor using files under `backend/internal/db/migrations/`.

- **Port 8080 or 8081 already in use**
  Find and kill the process: `netstat -ano | findstr :8080` then `taskkill /PID <pid> /F`. Or change the port in your config.

- **Expo Go says "requires a newer version"**
  Make sure the project uses SDK 54 (`expo` version in `mobile/package.json`). Update Expo Go from the app store if needed.

- **QR code says "no usable data found"**
  Use the Expo Go app to scan, not the regular camera app. On iOS, the Camera app works only if Expo Go is installed.
