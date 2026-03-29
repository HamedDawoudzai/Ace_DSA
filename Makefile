# Ace DSA monorepo - dev targets
# Run from repo root.

.PHONY: backend-run backend-build backend-test fmt

backend-build:
	cd backend && go build -o ace-dsa-api ./cmd/api

backend-run:
	cd backend && go run ./cmd/api

backend-test:
	cd backend && go test ./...

fmt:
	cd backend && gofmt -s -w .
	@echo "Formatted Go code."
