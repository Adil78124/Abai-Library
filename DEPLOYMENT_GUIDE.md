# Abai Library Deployment Guide

## Overview

Abai Library is deployed as five services:

- Next.js frontend
- NestJS backend
- PostgreSQL
- Redis
- MinIO

N8N is an external integration and must expose two backend-reachable webhooks.

## Production environment

Start from the examples:

```bash
cp backend/.env.production.example backend/.env
cp frontend/.env.production.example frontend/.env.local
```

Replace every placeholder. Required backend values:

- `NODE_ENV=production`
- `DATABASE_URL`
- `REDIS_URL`
- `SESSION_SECRET` with at least 32 characters
- `CORS_ORIGIN`
- `COOKIE_SECURE=true` behind HTTPS
- `COOKIE_SAME_SITE=lax` for same-site deployments, or `none` with secure cookies for cross-site deployments
- `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET`, `MINIO_PUBLIC_URL`
- `N8N_BOOK_PROCESSING_WEBHOOK_URL`, `N8N_CHAT_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`, `N8N_CALLBACK_SECRET`

Required frontend value:

- `NEXT_PUBLIC_API_URL=https://your-api.example.com/api`

## Docker deployment

```bash
docker compose config --no-interpolate
docker compose up --build -d
docker compose logs -f backend frontend
```

The compose file defaults to local-friendly `NODE_ENV=development` so you can
run smoke tests before N8N is configured. For production, set `NODE_ENV=production`
in `backend/.env`; backend startup will then fail fast if required production
secrets or N8N variables are missing.

Run migrations and seed on first deploy:

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run db:seed
```

Create an ADMIN user after registering normally:

```bash
docker compose exec postgres psql -U postgres -d abai_library
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## VPS deployment

1. Install Docker and Docker Compose plugin.
2. Clone the repository.
3. Create `backend/.env` and `frontend/.env.local`.
4. Configure DNS for frontend, API, and MinIO public URL.
5. Start services with `docker compose up --build -d`.
6. Run migrations and seed.
7. Configure a reverse proxy for HTTPS.

## Reverse proxy and HTTPS

Recommended shape:

- `https://library.example.com` -> frontend `localhost:3000`
- `https://api.library.example.com/api` -> backend `localhost:3001/api`
- `https://minio.library.example.com` -> MinIO API or a CDN/proxy in front of the bucket

If frontend and backend are same-site, use:

```env
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
CORS_ORIGIN=https://library.example.com
```

If frontend and backend are cross-site, use:

```env
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
CORS_ORIGIN=https://library.example.com
```

Do not use wildcard CORS with credentials.

## Health and readiness

- `GET /api/health/live`: process is alive
- `GET /api/health/ready`: PostgreSQL, Redis, and MinIO are reachable
- `GET /api/health`: same readiness payload for compatibility

Use `ready` for load balancer readiness and `live` for process liveness.

## Backup strategy

- PostgreSQL: daily automated backups plus pre-deploy snapshots
- Redis: enable persistence if session retention matters
- MinIO: bucket replication, object backups, or volume snapshots
- N8N: export workflows and credentials metadata according to your security policy
- Env files: store securely in a secrets manager, not in git

## Restore strategy

1. Stop backend/frontend writes if possible.
2. Restore PostgreSQL from backup.
3. Restore MinIO bucket data.
4. Restore or re-import N8N workflows.
5. Start Redis clean or restore persistence depending on session policy.
6. Run `GET /api/health/ready`.
7. Run the smoke test checklist from `RELEASE_CHECKLIST.md`.

## Update strategy

1. Pull the new release.
2. Review env changes in `.env.production.example`.
3. Run `docker compose config --no-interpolate`.
4. Build images.
5. Run migrations.
6. Restart backend and frontend.
7. Verify `/api/health/ready`, login, catalog, upload, N8N callback, and AI chat.

## Rollback checklist

- [ ] Keep previous Docker image tag or commit SHA
- [ ] Keep pre-deploy database backup
- [ ] Keep MinIO backup/snapshot
- [ ] Roll back code first if migrations are backward compatible
- [ ] Restore database only if needed
- [ ] Verify `/api/health/ready`
- [ ] Re-run smoke tests

## Observability

The backend emits structured request logs with method, path, status, and response time. It does not log request bodies, cookies, passwords, session IDs, or secrets.

Future integrations:

- Sentry for exceptions
- Prometheus metrics
- Grafana dashboards
- Log aggregation
