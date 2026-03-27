# How to start Ace DSA (for developers)

This guide gets the backend, database, and mobile app running locally.

## Prerequisites

- **Node.js** 20.19.4 or newer ([download](https://nodejs.org/en/download/))
- **Docker Desktop** ([download](https://www.docker.com/products/docker-desktop/)) or Go 1.26+ with a local Postgres
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

You need the API and Postgres running. Two options:

### A. Using Docker (simplest)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and start it.
2. From the repo root:

   ```bash
   docker compose up -d
   ```

3. Wait until both containers are up (about 10-15 seconds). The backend connects to Postgres and runs migrations automatically.

**Result:** API at http://localhost:8080, Postgres at localhost:5432 (user `acedsa`, password `acedsa`, database `acedsa`).

### B. Using Go and a local Postgres

1. Install [Go 1.26+](https://go.dev/dl/) and [PostgreSQL](https://www.postgresql.org/download/).
2. Create the database and user (in `psql` or any client):

   ```sql
   CREATE USER acedsa WITH PASSWORD 'acedsa';
   CREATE DATABASE acedsa OWNER acedsa;
   ```

3. Copy the env template and set your values:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env`:

   ```env
   DB_URL=postgres://acedsa:acedsa@localhost:5432/acedsa?sslmode=disable
   JWT_SECRET=your-secret-at-least-32-characters-long
   PORT=8080
   ```

4. Start the API:

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

```bash
# Stop Docker containers
docker compose down

# Stop Expo dev server
# Press Ctrl+C in the terminal running npx expo start
```

## Troubleshooting

- **"Node.js is outdated and unsupported"**
  Update Node.js to 20.19.4 or newer from [nodejs.org](https://nodejs.org/en/download/).

- **"go: command not found"**
  Install Go and add it to your PATH, then close and reopen your terminal.

- **"cannot connect to Docker"**
  Start Docker Desktop and wait until it is fully running.

- **Backend exits with "database: ..."**
  If using Docker, ensure `docker compose up -d` finished and Postgres is healthy. If running locally, check that Postgres is running and `DB_URL` in `backend/.env` is correct.

- **Port 8080 or 8081 already in use**
  Find and kill the process: `netstat -ano | findstr :8080` then `taskkill /PID <pid> /F`. Or change the port in your config.

- **Expo Go says "requires a newer version"**
  Make sure the project uses SDK 54 (`expo` version in `mobile/package.json`). Update Expo Go from the app store if needed.

- **QR code says "no usable data found"**
  Use the Expo Go app to scan, not the regular camera app. On iOS, the Camera app works only if Expo Go is installed.
