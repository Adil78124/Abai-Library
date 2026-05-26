import { Logger } from '@nestjs/common';

export type SafeLogLevel = 'log' | 'warn' | 'error' | 'debug';

const REDACTED_KEYS = [
  'password',
  'confirmPassword',
  'authorization',
  'cookie',
  'session',
  'secret',
  'token',
  'key',
];

export class AppLogger {
  private readonly logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  log(event: string, data: Record<string, unknown> = {}) {
    this.write('log', event, data);
  }

  warn(event: string, data: Record<string, unknown> = {}) {
    this.write('warn', event, data);
  }

  error(event: string, data: Record<string, unknown> = {}) {
    this.write('error', event, data);
  }

  debug(event: string, data: Record<string, unknown> = {}) {
    if (process.env.NODE_ENV !== 'production') {
      this.write('debug', event, data);
    }
  }

  private write(
    level: SafeLogLevel,
    event: string,
    data: Record<string, unknown>,
  ) {
    const redacted = this.redact(data) as Record<string, unknown>;
    const entry = {
      timestamp: new Date().toISOString(),
      event,
      ...redacted,
    };
    this.logger[level](JSON.stringify(entry));
  }

  private redact(value: unknown): unknown {
    if (Array.isArray(value)) return value.map((item) => this.redact(item));
    if (!value || typeof value !== 'object') return value;

    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        key,
        this.isSensitiveKey(key) ? '[redacted]' : this.redact(nested),
      ]),
    );
  }

  private isSensitiveKey(key: string): boolean {
    const normalized = key.toLowerCase();
    return REDACTED_KEYS.some((sensitive) => normalized.includes(sensitive));
  }
}

// TODO: Wire this logger to Sentry for exception traces after hosting is chosen.
// TODO: Export request and health metrics to Prometheus/Grafana in production.
