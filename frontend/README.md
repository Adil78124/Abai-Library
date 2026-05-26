# Abai Library — Frontend

Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui.

## Запуск

```bash
cp .env.example .env.local
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Переменная `NEXT_PUBLIC_API_URL` должна указывать на backend (по умолчанию `http://localhost:3001/api`).

## Auth

- `/login` — вход (`POST /api/auth/login`)
- `/signup` — регистрация (`POST /api/auth/register`)
- Сессия через cookie (`credentials: 'include'`)

## Каталог

Данные книг пока в `data/books.ts`. Поиск и фильтры: query-параметры `q`, `cat`, `filter`, `all`.

## Этап 5 — Frontend API migration + admin upload UI

- `/`, `/catalog`, `/book/[slug]` и `/book/[slug]/read` используют `lib/books-loader.ts`: сначала backend `/api/books`, затем fallback на `data/books.ts`.
- `lib/book-mapper.ts` приводит backend `ApiBook` к текущей UI-модели и выбирает PDF: `fileUrl` из backend/MinIO или legacy `/api/books/[slug]/pdf`.
- `BookAIChat.tsx` вызывает `POST /api/books/:id/chat` только для backend-книг с `aiAvailability=AVAILABLE`; `PROCESSING`, `FAILED`, `UNAVAILABLE` блокируют форму и показывают статус.
- `/admin/books` использует `lib/admin-books-api.ts`: список книг, upload/delete PDF, upload/delete image, `status`, `aiAvailability`, обработка 401/403.
- Header показывает ссылку “Админ” только при `user.role === 'ADMIN'`.

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Production

- Production env example: `.env.production.example`.
- `NEXT_PUBLIC_API_URL` должен указывать на публичный backend API или same-site reverse proxy.
- Для локального full-stack запуска из корня проекта используйте `docker compose up --build`.
- Stage 5 catalog note: страницы `/`, `/catalog`, `/book/[slug]` и `/book/[slug]/read` сначала читают backend Books API, затем используют fallback `data/books.ts`.
- Перед деплоем проверьте `/`, `/catalog`, `/book/[slug]`, `/book/[slug]/read`, `/admin/books`, login/signup/profile.

## AI

Чат на странице книги и `/assistant` — **демо-режим** (локальные ответы). Реальный AI — этап 3 (см. корневой `PRODUCTION_TODO.md`).
