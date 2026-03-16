# Ace DSA monorepo - dev targets
# Run from repo root.

.PHONY: backend-run backend-build backend-test fmt docker-up docker-down

backend-build:
	cd backend && go build -o ace-dsa-api ./cmd/api

backend-run:
	cd backend && go run ./cmd/api

backend-test:
	cd backend && go test ./...

fmt:
	cd backend && gofmt -s -w .
	@echo "Formatted Go code."

docker-up:
	docker compose up -d

docker-down:
	docker compose down
