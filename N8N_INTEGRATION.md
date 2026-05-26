# N8N Integration — Abai Library

Backend вызывает N8N webhooks; frontend **никогда** не обращается к N8N напрямую.

## Переменные окружения (backend)

| Переменная | Назначение |
|------------|------------|
| `N8N_BOOK_PROCESSING_WEBHOOK_URL` | Webhook после загрузки PDF |
| `N8N_CHAT_WEBHOOK_URL` | Webhook для AI-чата по книге |
| `N8N_WEBHOOK_SECRET` | Секрет в теле запроса backend → N8N |
| `N8N_CALLBACK_SECRET` | Секрет в заголовке N8N → backend callback |
| `N8N_TIMEOUT_MS` | Timeout HTTP (по умолчанию 30000) |

Если `N8N_BOOK_PROCESSING_WEBHOOK_URL` не задан: PDF сохраняется, `aiAvailability = UNAVAILABLE`, в ответе upload — warning.

Если `N8N_CALLBACK_SECRET` не задан: `POST /api/books/:id/end_upload` возвращает ошибку (500 в production, 401 в development).

## 1. Обработка книги после PDF upload

После успешного `POST /api/books/:id/upload/pdf` backend отправляет:

```http
POST {N8N_BOOK_PROCESSING_WEBHOOK_URL}
Content-Type: application/json
```

```json
{
  "bookId": "uuid",
  "title": "Название",
  "author": "Автор",
  "fileKey": "books/{bookId}/pdf/...",
  "fileUrl": "http://localhost:9000/abai-library/books/...",
  "secret": "your-n8n-webhook-secret"
}
```

В БД книга в статусе `aiAvailability: PROCESSING`.

N8N должен:

1. Скачать PDF по `fileUrl` (или использовать `fileKey` с MinIO).
2. Выполнить индексацию / подготовку для RAG.
3. Вызвать callback на backend.

## 2. Callback завершения обработки

```http
POST http://localhost:3001/api/books/{bookId}/end_upload
Content-Type: application/json
x-n8n-callback-secret: {N8N_CALLBACK_SECRET}
```

```json
{
  "success": true
}
```

При ошибке обработки:

```json
{
  "success": false,
  "error": "Optional short error description"
}
```

| success | `aiAvailability` |
|---------|------------------|
| `true` | `AVAILABLE` |
| `false` | `FAILED` |

## 3. AI-чат по книге

Frontend (когда будет подключён) вызывает:

```http
POST /api/books/{bookId}/chat
```

Backend проксирует в N8N:

```http
POST {N8N_CHAT_WEBHOOK_URL}
Content-Type: application/json
```

```json
{
  "bookId": "uuid",
  "message": "О чём эта книга?",
  "sessionId": "optional-session-id",
  "userId": "optional-user-id",
  "secret": "your-n8n-webhook-secret"
}
```

Ожидаемый ответ N8N:

```json
{
  "answer": "Текст ответа ассистента"
}
```

Backend возвращает клиенту:

```json
{
  "answer": "..."
}
```

### Коды ошибок proxy

| HTTP | Когда |
|------|--------|
| 404 | Книга не найдена / не опубликована |
| 409 | `aiAvailability !== AVAILABLE` |
| 503 | `N8N_CHAT_WEBHOOK_URL` не настроен |
| 502 | N8N недоступен или неверный ответ |

## 4. Lifecycle `aiAvailability`

```
PDF upload success + N8N started     → PROCESSING
PDF upload, N8N URL missing          → UNAVAILABLE
PDF upload, N8N call failed          → FAILED
end_upload success=true              → AVAILABLE
end_upload success=false             → FAILED
PDF deleted                          → UNAVAILABLE
```

## 5. TODO (этап 5+)

- SSE / streaming ответов чата
- Rate limiting на `/api/books/:id/chat`
- Подпись webhook (HMAC) вместо shared secret в body
- Подключение `BookAIChat.tsx` к backend proxy
