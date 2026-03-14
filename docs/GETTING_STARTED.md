# How to start Ace DSA (for developers)

This guide gets the backend and database running so you can work on the API or the iOS app.

## 1. Clone and open the repo

```bash
git clone https://github.com/HamedDawoudzai/Ace_DSA.git
cd Ace_DSA
```

(Use your actual clone URL if different.)

## 2. Start the backend and database

You need the API and Postgres running. Two ways:

### A. Using Docker (simplest)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and start it.
2. From the repo root:

   ```bash
   docker compose up -d
   ```

3. Wait until both containers are up (about 10–15 seconds). The backend will connect to Postgres and run migrations automatically.

**Result:** API at http://localhost:8080, Postgres at localhost:5432 (user `acedsa`, password `acedsa`, database `acedsa`).

### B. Using Go and a local Postgres

1. Install [Go 1.26+](https://go.dev/dl/) and [PostgreSQL](https://www.postgresql.org/download/).
2. Create the database and user (in `psql` or any client):

   ```sql
   CREATE USER acedsa WITH PASSWORD 'acedsa';
   CREATE DATABASE acedsa OWNER acedsa;
   ```

3. In the repo, copy the env template and set the database URL:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env` and set:

   ```env
   DB_URL=postgres://acedsa:acedsa@localhost:5432/acedsa?sslmode=disable
   JWT_SECRET=your-secret-at-least-32-characters-long
   PORT=8080
   ```

4. Start the API from the repo root:

   ```bash
   make backend-run
   ```

   Or:

   ```bash
   cd backend
   go run ./cmd/api
   ```

**Result:** API at http://localhost:8080. Migrations run on startup.

## 3. Check that the backend is running

```bash
curl http://localhost:8080/health
# should print: ok

curl http://localhost:8080/
# should print: {"service":"ace-dsa-api","status":"running"}
```

If you see that, the backend and DB are up.

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

## 4. (Optional) Run the iOS app

1. Open Xcode and create a new App project (SwiftUI), product name **AceDSA**.
2. Save it inside the repo’s `ios/` folder (e.g. `Ace_DSA/ios/`).
3. Build and run in the simulator or on a device. Point the app at `http://localhost:8080` when using the simulator; use your machine’s LAN IP if testing on a real device.

## 5. Stop everything (Docker only)

From the repo root:

```bash
docker compose down
```

## Troubleshooting

- **“go: command not found”**  
  Install Go and add it to your PATH, then close and reopen your terminal (or IDE).

- **“cannot connect to Docker”**  
  Start Docker Desktop and wait until it’s fully running.

- **Backend exits with “database: ...”**  
  If using Docker, ensure `docker compose up -d` finished and Postgres is healthy. If running locally, check that Postgres is running and `DB_URL` in `backend/.env` is correct.

- **Port 8080 or 5432 already in use**  
  Stop whatever is using that port, or change `PORT` in `.env` (and in `docker-compose.yml` for 8080) and the Postgres port mapping for 5432.
