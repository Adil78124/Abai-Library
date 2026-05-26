# Production checklist — Abai Library

## Этап 1 — стабилизация (выполнен)

- [x] Восстановлен backend `src`: auth, users, prisma, session guard
- [x] Синхронизирован `prisma/schema.prisma` (User, Role)
- [x] `main.ts`: prefix `/api`, CORS из env, Redis sessions, обязательный `SESSION_SECRET`
- [x] `backend/.env.example`, `frontend/.env.example`
- [x] Frontend API client (`lib/api.ts`) + auth (`lib/auth-api.ts`)
- [x] Login / signup / logout / me
- [x] Каталог: client-side поиск и query params (статические данные)
- [x] AI: демо-badge, заготовка `lib/ai-api.ts`
- [x] `.gitignore` (dist, .next, .env, generated)
- [x] README запуска

## Этап 2 — Books API (выполнен)

- [x] Prisma: `Book`, `BookStatus`, `AiAvailability`
- [x] Миграция `20260518120000_add_books`
- [x] `@Roles()` + `RolesGuard` (401 / 403)
- [x] Модуль `books`: CRUD, публичный список и деталь
- [x] Slugify + уникальность slug
- [x] Seed: `npm run db:seed` (`prisma/seed.ts`, 14 книг)
- [x] Frontend заготовка: `lib/books-api.ts` (без подключения страниц)

## Этап 3 — MinIO и upload system (выполнен)

- [x] `StorageModule` + AWS SDK v3 (`@aws-sdk/client-s3`)
- [x] Upload PDF / image в MinIO (ключи `books/{bookId}/pdf|images/...`)
- [x] ADMIN endpoints: upload / delete pdf & image
- [x] Валидация MIME и размеров (PDF 100MB, image 10MB)
- [x] `aiAvailability`: PROCESSING после PDF upload, UNAVAILABLE после delete, FAILED при ошибке
- [x] `POST /api/books/:id/end_upload` (заготовка, без webhook security)
- [x] `docker-compose.minio.yml`, env в `.env.example`
- [x] Frontend: `lib/admin-books-api.ts` (UI завершён в этапе 5)
- [x] Файлы только в MinIO (multer memory → S3, не на диск)

## Этап 4 — N8N + AI proxy (выполнен)

- [x] `N8nModule` / `N8nService` (fetch, timeout, env-only URLs)
- [x] PDF upload → webhook `N8N_BOOK_PROCESSING_WEBHOOK_URL`
- [x] `end_upload` защищён `x-n8n-callback-secret` (`N8nCallbackGuard`)
- [x] `POST /api/books/:id/chat` — AI proxy к N8N
- [x] `frontend/lib/ai-api.ts` — `chatWithBook()` (UI ещё демо)
- [x] `N8N_INTEGRATION.md`
- [ ] Streaming AI (TODO в коде)
- [x] Rate limit на chat

## Этап 5 — Frontend API migration + admin upload UI (выполнен)

- [x] `/`, `/catalog`, `/book/[slug]`, `/book/[slug]/read` используют backend Books API через `frontend/lib/books-loader.ts`
- [x] Fallback на `frontend/data/books.ts`, если backend недоступен или API-книга не найдена
- [x] `frontend/lib/book-mapper.ts`: mapping `ApiBook` → UI book, `fileUrl`/legacy PDF resolution, `canReadBook`
- [x] `BookAIChat.tsx` подключён к `POST /api/books/:id/chat`
- [x] UI состояния `aiAvailability`: `AVAILABLE`, `PROCESSING`, `FAILED`, `UNAVAILABLE`
- [x] PDF reader использует backend `fileUrl`, затем legacy `/api/books/[slug]/pdf`, затем сообщение “PDF недоступен”
- [x] `/admin/books`: список, upload/delete PDF, upload/delete image, `status`, `aiAvailability`
- [x] Header показывает “Админ” только для `role === 'ADMIN'`
- [x] Env frontend: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`

## Этап 6 — Production infrastructure

- [x] HTTPS-ready `secure` cookies, `trust proxy` на NestJS
- [x] Rate limiting на auth
- [x] Health checks (`/api/health`)
- [x] CI: lint + build + test
- [x] Docker Compose (app + pg + redis + minio)
- [ ] Мониторинг и логирование
- [ ] next-intl (kk/ru/en) — по необходимости
- [ ] orval для OpenAPI-клиента

## Перед деплоем — обязательно

- [ ] Уникальный `SESSION_SECRET` (32+ символов)
- [ ] `NODE_ENV=production`
- [ ] `CORS_ORIGIN` = production URL фронтенда
- [ ] PostgreSQL и Redis managed / backed up
- [ ] Не коммитить `.env`, `dist/`, `generated/`
- [ ] Проверить `npm run build` в `frontend/` и `backend/`
- [ ] Создать ADMIN-пользователя для управления книгами
Stage 6 completed: secure cookies, trust proxy, CORS hardening, helmet, production SESSION_SECRET length check, auth/chat rate limits, /api/health, Docker Compose full stack, backend/frontend Dockerfiles, production env examples, CI, and logging hygiene. Sentry/Prometheus plus next-intl/orval remain optional post-release work.

Stage 7 completed: final QA pass, mobile header polish, not-found/error pages, footer link cleanup, release checklist, final build gates, and Docker Compose config validation.

Stage 8 completed: structured safe request logging, observability prep, `/api/health/live`, `/api/health/ready`, production env validation, admin UX polish, AI retry/loading polish, Makefile helpers, and deployment guide.

Optional future work:
- [ ] Streaming AI responses
- [ ] Sentry/Prometheus monitoring integrations
- [ ] Product analytics
- [ ] Notifications
- [ ] next-intl (kk/ru/en)
- [ ] orval/OpenAPI client generation
