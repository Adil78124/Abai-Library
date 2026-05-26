# Abai Library Release Checklist

## Production env

- [ ] `NODE_ENV=production`
- [ ] `SESSION_SECRET` is unique and at least 32 characters
- [ ] `CORS_ORIGIN` contains only trusted frontend origins
- [ ] `COOKIE_SECURE=true` behind HTTPS
- [ ] `COOKIE_SAME_SITE=lax` for same-site deployments or `none` with `COOKIE_SECURE=true` for cross-site deployments
- [ ] `DATABASE_URL` points to production PostgreSQL
- [ ] `REDIS_URL` points to production Redis
- [ ] `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET`, `MINIO_PUBLIC_URL` are configured
- [ ] `N8N_BOOK_PROCESSING_WEBHOOK_URL`, `N8N_CHAT_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`, `N8N_CALLBACK_SECRET` are configured
- [ ] `NEXT_PUBLIC_API_URL` points to the public backend API

## Deploy steps

1. Build and deploy PostgreSQL, Redis, MinIO, backend, and frontend.
2. Run backend migrations:

```bash
npx prisma migrate deploy
```

3. Generate Prisma client if the deploy platform does not run it during build:

```bash
npx prisma generate
```

4. Seed initial books when deploying a fresh database:

```bash
npm run db:seed
```

5. Create or promote an admin user:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## MinIO

- [ ] Bucket from `MINIO_BUCKET` exists
- [ ] Backend can upload PDF and image files
- [ ] Public file URLs are reachable by the frontend
- [ ] Bucket permissions match the chosen hosting model
- [ ] Backups or lifecycle rules are configured

## N8N

- [ ] Book processing webhook is active
- [ ] Chat webhook is active
- [ ] Shared webhook secrets match backend env
- [ ] `POST /api/books/:id/end_upload` succeeds with `x-n8n-callback-secret`
- [ ] Successful processing sets `aiAvailability=AVAILABLE`
- [ ] Failed processing sets `aiAvailability=FAILED`

## Smoke test

- [ ] `GET /api/health` returns `status: ok`
- [ ] User can register
- [ ] User can login/logout
- [ ] `GET /api/auth/me` returns the logged-in user
- [ ] `GET /api/books` returns published books
- [ ] `/` loads featured books
- [ ] `/catalog` search and filters work
- [ ] `/book/[slug]` loads a book detail page
- [ ] `/book/[slug]/read` opens backend PDF or legacy fallback PDF
- [ ] Backend unavailable fallback uses `frontend/data/books.ts`
- [ ] Non-admin user does not see the admin link
- [ ] Admin user sees `/admin/books`
- [ ] Admin can upload/delete PDF
- [ ] Admin can upload/delete image
- [ ] AI chat is enabled only when `aiAvailability=AVAILABLE`
- [ ] AI unavailable states are understandable to the user
- [ ] 404 and error pages are presentable
- [ ] Header, catalog, book detail, reader, and admin pages do not overflow on mobile

## Backups

- [ ] PostgreSQL automated backups are enabled
- [ ] Redis persistence/backup policy is understood
- [ ] MinIO bucket backups are enabled
- [ ] N8N workflows are exported or backed up
- [ ] Restore procedure has been tested at least once

## Post-deploy verification

- [ ] Check backend logs for startup errors
- [ ] Check frontend logs for build/runtime errors
- [ ] Verify health endpoint after deploy
- [ ] Upload a small PDF and image
- [ ] Trigger N8N processing callback
- [ ] Ask one AI chat question for an available book
- [ ] Confirm rate limiting does not block normal usage
- [ ] Confirm no secrets appear in logs or public responses

## Future work

- Streaming AI responses
- Full observability with Sentry/Prometheus
- Analytics
- Notifications
- `next-intl`
- OpenAPI client generation with orval
