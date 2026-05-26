const REQUIRED_ALWAYS = [
  'DATABASE_URL',
  'REDIS_URL',
  'SESSION_SECRET',
  'MINIO_ENDPOINT',
  'MINIO_ACCESS_KEY',
  'MINIO_SECRET_KEY',
  'MINIO_BUCKET',
];

const REQUIRED_PRODUCTION = [
  'CORS_ORIGIN',
  'COOKIE_SECURE',
  'COOKIE_SAME_SITE',
  'N8N_BOOK_PROCESSING_WEBHOOK_URL',
  'N8N_CHAT_WEBHOOK_URL',
  'N8N_WEBHOOK_SECRET',
  'N8N_CALLBACK_SECRET',
];

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function requireBoolean(name: string) {
  const value = requireEnv(name).toLowerCase();
  if (value !== 'true' && value !== 'false') {
    throw new Error(`${name} must be "true" or "false"`);
  }
}

export function validateEnv() {
  for (const name of REQUIRED_ALWAYS) {
    requireEnv(name);
  }

  if (process.env.NODE_ENV !== 'production') return;

  for (const name of REQUIRED_PRODUCTION) {
    requireEnv(name);
  }

  requireBoolean('COOKIE_SECURE');

  if (requireEnv('SESSION_SECRET').length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters in production');
  }

  const corsOrigins = requireEnv('CORS_ORIGIN')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (corsOrigins.length === 0 || corsOrigins.includes('*')) {
    throw new Error('CORS_ORIGIN must list trusted origins and cannot include "*"');
  }
}
