.PHONY: backend-build frontend-build build docker-up docker-down docker-logs docker-config

backend-build:
	cd backend && npm run build

frontend-build:
	cd frontend && npm run build

build: backend-build frontend-build

docker-up:
	docker compose up --build

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

docker-config:
	docker compose config --no-interpolate
