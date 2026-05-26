# Stage 6 — Production infrastructure + security

- Backend: `helmet`, production `trust proxy`, env-driven secure cookies, no wildcard CORS with credentials, multiple `CORS_ORIGIN` values via comma.
- Session: `SESSION_SECRET` is required; in production it must be at least 32 characters.
- Rate limits: login/register use `AUTH_RATE_LIMIT_PER_MINUTE`, book AI chat uses `AI_CHAT_RATE_LIMIT_PER_MINUTE`.
- Health: `GET /api/health` returns HTTP 200 with `status` = `ok` or `degraded`; `database`, `redis`, `minio` are `ok`/`error`.
- Docker: `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, and production env examples are included.
- CI: `.github/workflows/ci.yml` installs deps, generates Prisma client, and runs lint/test/build checks.

```bash
cp backend/.env.production.example backend/.env
cp frontend/.env.production.example frontend/.env.local
docker compose up --build
```

After first start:

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run db:seed
```

Deployment smoke checks: `/api/health`, login/register/me, `/api/books`, `/admin/books`, PDF upload/delete, N8N `end_upload` callback with `x-n8n-callback-secret`, and AI chat for a book with `aiAvailability=AVAILABLE`.

# Stage 7 — Final QA + release preparation

- Added final `not-found` and global `error` pages.
- Polished mobile header behavior to avoid navigation overflow.
- Removed footer links to missing routes.
- Added [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) with production env, deploy, smoke test, backup, and post-deploy verification steps.
- Final builds and Docker Compose config are expected release gates.

# Stage 8 — Final production hardening

- Added structured backend request logging without bodies, cookies, session IDs, passwords, or secrets.
- Added `/api/health/live` and `/api/health/ready` alongside `/api/health`.
- Added fail-fast production env validation for database, Redis, MinIO, session, cookie, CORS, and N8N settings.
- Polished admin image previews, empty state, and row-level operation locking.
- Polished book AI chat retry, loading, auto-scroll, and clearer unavailable messages.
- Added [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) and Makefile helpers for build and Docker workflows.

# Abai Library

Электронная библиотека: Next.js frontend + NestJS backend.

## Структура

| Папка | Описание |
|-------|----------|
| `frontend/` | Next.js 14, каталог книг (статические данные), PDF-читалка, auth UI |
| `backend/` | NestJS 11, session-auth, PostgreSQL, Redis |

## Быстрый старт (разработка)

### 1. Инфраструктура

Нужны **PostgreSQL**, **Redis** и **MinIO** (для загрузки файлов книг).

```bash
# PostgreSQL и Redis
docker run -d --name abai-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=abai_library -p 5432:5432 postgres:16
docker run -d --name abai-redis -p 6379:6379 redis:7

# MinIO (API :9000, консоль :9001)
docker compose -f docker-compose.minio.yml up -d
```

В консоли MinIO (http://localhost:9001, `minioadmin` / `minioadmin`) создайте bucket **`abai-library`** и при необходимости политику публичного чтения для объектов.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Отредактируйте DATABASE_URL, REDIS_URL, SESSION_SECRET, MINIO_*

npm install
npx prisma migrate deploy
npx prisma generate
npm run start:dev
```

API: `http://localhost:3001/api`  

**Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`

**Books (этап 2):** `GET /api/books`, `GET /api/books/:idOrSlug`, admin: `POST/PATCH/DELETE /api/books`

После миграций загрузите каталог в БД:

```bash
npm run db:seed
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001/api

npm install
npm run dev
```

Сайт: `http://localhost:3000`

## Этап 4 — N8N и AI proxy

См. [N8N_INTEGRATION.md](./N8N_INTEGRATION.md).

| Метод | Путь | Доступ |
|--------|------|--------|
| POST | `/api/books/:id/chat` | Публично (MVP), `aiAvailability` должно быть `AVAILABLE` |
| POST | `/api/books/:id/end_upload` | N8N callback + header `x-n8n-callback-secret` |

После PDF upload backend вызывает `N8N_BOOK_PROCESSING_WEBHOOK_URL`. Frontend AI (`lib/ai-api.ts`) готов, UI чата пока демо.

## Этап 3 — MinIO и upload

Файлы книг хранятся в MinIO (не на локальном диске backend). В БД в `Book.file` / `Book.image` — object key (`books/{id}/...`).

| Метод | Путь | Доступ |
|--------|------|--------|
| POST | `/api/books/:id/upload/pdf` | ADMIN (multipart `file`) |
| POST | `/api/books/:id/upload/image` | ADMIN |
| DELETE | `/api/books/:id/pdf` | ADMIN |
| DELETE | `/api/books/:id/image` | ADMIN |
| POST | `/api/books/:id/end_upload` | N8N only (`x-n8n-callback-secret`) |

**Lifecycle `aiAvailability`:** после загрузки PDF → `PROCESSING`; callback `end_upload` с `{ "success": true }` → `AVAILABLE`; удаление PDF → `UNAVAILABLE`.

Клиент для админки: `frontend/lib/admin-books-api.ts`; минимальный UI доступен на `/admin/books`.

## Этап 2 — Books API

Публичный каталог в PostgreSQL (модель `Book`). Frontend пока читает `frontend/data/books.ts`; API-клиент готов в `frontend/lib/books-api.ts`.

| Метод | Путь | Доступ |
|--------|------|--------|
| GET | `/api/books` | Публично (`PUBLISHED`, поиск, пагинация) |
| GET | `/api/books/:idOrSlug` | Публично (admin видит DRAFT/ARCHIVED) |
| POST | `/api/books` | ADMIN |
| PATCH | `/api/books/:id` | ADMIN |
| DELETE | `/api/books/:id` | ADMIN |

## Этап 5 — Frontend API migration + admin upload UI

- Главная `/`, `/catalog`, `/book/[slug]` и `/book/[slug]/read` берут книги через `frontend/lib/books-loader.ts`, который сначала обращается к backend `/api/books`.
- Если backend недоступен или книга не найдена в API, frontend использует legacy fallback из `frontend/data/books.ts`; файл не удаляется и остаётся источником локальных PDF через `/api/books/[slug]/pdf`.
- PDF reader выбирает `fileUrl` из backend/MinIO, а при его отсутствии использует legacy `pdfPath`; если PDF нет, показывается сообщение “PDF недоступен”.
- `BookAIChat.tsx` подключён к `POST /api/books/:id/chat`; реальные ответы доступны только при `aiAvailability=AVAILABLE`, остальные состояния показывают disabled UI. Static fallback-книги остаются в demo mode.
- Добавлена минимальная админка `/admin/books`: список книг, upload/delete PDF, upload/delete image, `status`, `aiAvailability`, обработка 401/403 и ошибок операций.
- Ссылка “Админ” в header показывается только пользователю с `role === 'ADMIN'`.
- Обязательная frontend env:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Stage 6 update: production infrastructure, secure cookies, rate limiting, health checks, CI and docker compose are implemented. Этап 7 остаётся для финального QA, UI polish и release checklist.

## Production checklist

См. [PRODUCTION_TODO.md](./PRODUCTION_TODO.md).

## Документация

- [PROJECT_AUDIT_REPORT.md](./PROJECT_AUDIT_REPORT.md) — аудит проекта
- [PRODUCTION_TODO.md](./PRODUCTION_TODO.md) — чеклист перед продакшеном
