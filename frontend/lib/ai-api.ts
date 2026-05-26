import { ApiError, apiFetch } from './api';

export type AiChatRole = 'user' | 'assistant';

export type AiChatMessage = {
  id: string;
  role: AiChatRole;
  text: string;
};

export type BookChatPayload = {
  message: string;
  sessionId?: string;
};

export type BookChatAnswer = {
  answer: string;
};

export class AiApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: 'not_ready' | 'not_configured' | 'unavailable',
  ) {
    super(message);
    this.name = 'AiApiError';
  }
}

function mapAiError(err: unknown): never {
  if (err instanceof ApiError) {
    if (err.status === 409) {
      throw new AiApiError(
        'ИИ-помощник для этой книги ещё не готов',
        409,
        'not_ready',
      );
    }
    if (err.status === 503) {
      throw new AiApiError(
        'AI service is not configured',
        503,
        'not_configured',
      );
    }
    if (err.status === 502) {
      throw new AiApiError(
        'AI service is temporarily unavailable',
        502,
        'unavailable',
      );
    }
    throw new AiApiError(err.message, err.status);
  }
  throw err;
}

/**
 * POST /api/books/:bookId/chat — backend proxy к N8N.
 * Пока не подключено в BookAIChat.tsx (демо-режим на UI).
 * TODO: SSE/streaming parser; retry/cancel support.
 */
export async function chatWithBook(
  bookId: string,
  payload: BookChatPayload,
): Promise<BookChatAnswer> {
  try {
    return await apiFetch<BookChatAnswer>(
      `/books/${encodeURIComponent(bookId)}/chat`,
      {
        method: 'POST',
        json: payload,
      },
    );
  } catch (err) {
    mapAiError(err);
  }
}

/** Общий ассистент по каталогу — этап 5+ */
export async function sendAssistantMessage(
  _message: string,
): Promise<{ reply: string }> {
  throw new Error(
    'Каталоговый AI-ассистент ещё не подключён. Используйте демо-режим.',
  );
}
