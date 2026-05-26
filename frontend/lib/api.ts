const configuredApiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
const apiWarningGlobal = globalThis as typeof globalThis & {
  __ABAI_API_WARNING_SHOWN__?: boolean;
};

if (
  !configuredApiBase &&
  typeof console !== 'undefined' &&
  !apiWarningGlobal.__ABAI_API_WARNING_SHOWN__
) {
  console.warn(
    'NEXT_PUBLIC_API_URL is not configured; using http://localhost:3001/api fallback.',
  );
  apiWarningGlobal.__ABAI_API_WARNING_SHOWN__ = true;
}

const API_BASE = configuredApiBase ?? 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiFetchOptions = RequestInit & {
  json?: unknown;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { json, headers, ...rest } = options;
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...rest,
    credentials: 'include',
    headers: {
      ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : typeof data === 'object' &&
            data !== null &&
            'message' in data &&
            Array.isArray((data as { message: unknown }).message)
          ? String((data as { message: string[] }).message[0])
          : `Ошибка запроса (${res.status})`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

export { API_BASE };
