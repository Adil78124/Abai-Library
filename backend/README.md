# Abai Library — Backend

NestJS 11, Prisma 7, PostgreSQL, Redis (sessions), MinIO (файлы книг).

## Запуск

```bash
cp .env.example .env
# DATABASE_URL, REDIS_URL, SESSION_SECRET, MINIO_*

npm install
npx prisma migrate deploy
npx prisma generate
npm run start:dev
```

API: `http://localhost:3001/api`

## Production security

- `SESSION_SECRET` обязателен; в `NODE_ENV=production` backend падает при секрете короче 32 символов.
- Cookie settings управляются env: `COOKIE_SECURE`, `COOKIE_SAME_SITE`, `COOKIE_DOMAIN`. Для разных sites используйте `COOKIE_SAME_SITE=none` только вместе с `COOKIE_SECURE=true`; для same-site deployment обычно достаточно `lax`.
- В production включается `trust proxy = 1`.
- `CORS_ORIGIN` поддерживает несколько origins через запятую; wildcard `*` запрещён при `credentials: true`.
- `helmet` включён в bootstrap, `crossOriginResourcePolicy` отключён, чтобы не ломать dev/uploads.
- Rate limits: `AUTH_RATE_LIMIT_PER_MINUTE` для login/register, `AI_CHAT_RATE_LIMIT_PER_MINUTE` для `/api/books/:id/chat`, `DEFAULT_RATE_LIMIT_PER_MINUTE` как базовое значение.

## Health

Health endpoints always return HTTP 200:

- `GET /api/health/live` — process liveness
- `GET /api/health/ready` — PostgreSQL, Redis, and MinIO readiness
- `GET /api/health` — readiness-compatible response

```json
{
  "status": "ok",
  "timestamp": "2026-05-21T00:00:00.000Z",
  "services": {
    "database": "ok",
    "redis": "ok",
    "minio": "ok"
  }
}
```

Если PostgreSQL, Redis или MinIO bucket недоступны, `status` становится `degraded`, а соответствующий сервис получает `error`. Endpoint не раскрывает secrets; детали ошибок уходят только в Nest Logger.

HTTP request logs are structured and include method, path, status, and response time. Bodies, cookies, session IDs, passwords, and secrets are not logged.

## MinIO (локально)

```bash
# из корня репозитория
docker compose -f docker-compose.minio.yml up -d
```

- API: http://localhost:9000
- Console: http://localhost:9001 (`minioadmin` / `minioadmin`)
- Создайте bucket `abai-library` (имя из `MINIO_BUCKET`)

## Auth endpoints

| Method | Path | Описание |
|--------|------|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/logout` | Выход |
| GET | `/api/auth/me` | Текущий пользователь (cookie session) |

## Books API

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/books` | Public (published only) |
| GET | `/api/books/:idOrSlug` | Public (admin sees all statuses) |
| POST | `/api/books` | ADMIN + session |
| PATCH | `/api/books/:id` | ADMIN + session |
| DELETE | `/api/books/:id` | ADMIN + session |

## Upload (этап 3)

| Method | Path | Access |
|--------|------|--------|
| POST | `/api/books/:id/upload/pdf` | ADMIN, multipart `file`, max 100MB |
| POST | `/api/books/:id/upload/image` | ADMIN, JPEG/PNG/WebP, max 10MB |
| DELETE | `/api/books/:id/pdf` | ADMIN |
| DELETE | `/api/books/:id/image` | ADMIN |
| POST | `/api/books/:id/chat` | Public MVP, proxy to N8N |
| POST | `/api/books/:id/end_upload` | N8N callback, header `x-n8n-callback-secret` |

После PDF upload: `aiAvailability = PROCESSING`.  
`end_upload` success → `AVAILABLE`, failure → `FAILED`.  
Удаление PDF → `UNAVAILABLE`.

Object keys: `books/{bookId}/pdf/...`, `books/{bookId}/images/...`.

### Seed каталога

```bash
npm run db:seed
```

ADMIN в PostgreSQL:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## Обязательные переменные

- `DATABASE_URL`, `REDIS_URL`, `SESSION_SECRET`
- `MINIO_*` — object storage
- `N8N_BOOK_PROCESSING_WEBHOOK_URL`, `N8N_CHAT_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`, `N8N_CALLBACK_SECRET` — для N8N (см. `N8N_INTEGRATION.md`)

## Docker

Из корня проекта:

```bash
cp backend/.env.production.example backend/.env
cp frontend/.env.production.example frontend/.env.local
docker compose up --build
```

После первого старта примените миграции и seed внутри backend-контейнера:

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run db:seed
```

Создать ADMIN пользователя:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Production env additions: `COOKIE_SECURE`, `COOKIE_SAME_SITE`, `COOKIE_DOMAIN`, `CORS_ORIGIN`, `AUTH_RATE_LIMIT_PER_MINUTE`, `AI_CHAT_RATE_LIMIT_PER_MINUTE`.

Production TODO для observability: подключить Sentry/Prometheus после выбора hosting-платформы.

## N8N

См. корневой [N8N_INTEGRATION.md](../N8N_INTEGRATION.md).
