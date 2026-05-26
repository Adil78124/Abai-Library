import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AppLogger } from '../common/logger/app-logger';

export type StartBookProcessingParams = {
  bookId: string;
  title: string;
  author: string;
  fileKey: string;
  fileUrl: string;
};

export type ChatWithBookParams = {
  bookId: string;
  message: string;
  sessionId?: string;
  userId?: string;
};

@Injectable()
export class N8nService {
  private readonly logger = new AppLogger(N8nService.name);
  private readonly timeoutMs = Number(process.env.N8N_TIMEOUT_MS ?? 30_000);

  isBookProcessingConfigured(): boolean {
    return Boolean(process.env.N8N_BOOK_PROCESSING_WEBHOOK_URL?.trim());
  }

  isChatConfigured(): boolean {
    return Boolean(process.env.N8N_CHAT_WEBHOOK_URL?.trim());
  }

  async startBookProcessing(params: StartBookProcessingParams): Promise<void> {
    const url = process.env.N8N_BOOK_PROCESSING_WEBHOOK_URL?.trim();
    if (!url) {
      throw new Error('N8N_BOOK_PROCESSING_WEBHOOK_URL is not configured');
    }

    const payload = {
      bookId: params.bookId,
      title: params.title,
      author: params.author,
      fileKey: params.fileKey,
      fileUrl: params.fileUrl,
      secret: process.env.N8N_WEBHOOK_SECRET?.trim() ?? undefined,
    };

    await this.postJson(url, payload, 'book processing');
  }

  async chatWithBook(params: ChatWithBookParams): Promise<{ answer: string }> {
    const url = process.env.N8N_CHAT_WEBHOOK_URL?.trim();
    if (!url) {
      throw new ServiceUnavailableException('AI service is not configured');
    }

    const payload = {
      bookId: params.bookId,
      message: params.message,
      sessionId: params.sessionId,
      userId: params.userId,
      secret: process.env.N8N_WEBHOOK_SECRET?.trim() ?? undefined,
    };

    const data = await this.postJson(url, payload, 'chat');

    const answer =
      typeof data === 'object' &&
      data !== null &&
      'answer' in data &&
      typeof (data as { answer: unknown }).answer === 'string'
        ? (data as { answer: string }).answer
        : null;

    if (!answer?.trim()) {
      this.logger.warn('n8n_empty_answer', { context: 'chat' });
      throw new BadGatewayException('AI service is temporarily unavailable');
    }

    return { answer: answer.trim() };
  }

  private async postJson(
    url: string,
    body: Record<string, unknown>,
    context: string,
  ): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        this.logger.warn('n8n_webhook_bad_status', {
          context,
          status: response.status,
        });
        throw new Error(`N8N ${context} responded with status ${response.status}`);
      }

      const text = await response.text();
      if (!text) return {};
      try {
        return JSON.parse(text) as unknown;
      } catch {
        return { answer: text };
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unknown N8N request error';
      if (message.includes('abort')) {
        this.logger.warn('n8n_webhook_timeout', {
          context,
          timeoutMs: this.timeoutMs,
        });
      } else {
        this.logger.warn('n8n_webhook_error', { context, message });
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}
