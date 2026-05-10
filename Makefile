# Ace DSA monorepo — dev & deploy targets
# Run from repo root.

.PHONY: build test run fmt seed migrate vet \
        docker-up docker-down docker-build \
        mobile-install mobile-start mobile-lint

# ── Backend ──────────────────────────────────────────────────────────────────

build:
	cd backend && go build -o ace-dsa-api ./cmd/api

run:
	cd backend && go run ./cmd/api

test:
	cd backend && go test ./...

vet:
	cd backend && go vet ./...

fmt:
	cd backend && gofmt -s -w .
	@echo "Formatted Go code."

migrate:
	cd backend && go run ./cmd/api --migrate-only

seed:
	cd backend && go run ./cmd/seed

# ── Docker ───────────────────────────────────────────────────────────────────

docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f api

# ── Mobile ───────────────────────────────────────────────────────────────────

mobile-install:
	cd mobile && npm install

mobile-start:
	cd mobile && npx expo start

mobile-lint:
	cd mobile && npx tsc --noEmit
