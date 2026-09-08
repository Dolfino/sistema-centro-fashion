import { Platform } from 'react-native';

/**
 * Cliente HTTP da Plataforma Mall com retry/backoff e resolução de base URL por ambiente.
 *
 * - Produção (bundle release): https://api-mall.ideiasmkt.com.br/api/v1
 * - Desenvolvimento web (localhost): http://localhost:3000/api/v1
 * - Desenvolvimento Android (emulador): http://10.0.2.2:3000/api/v1 (aponta para o host)
 * - Desenvolvimento iOS (simulador): http://localhost:3000/api/v1
 */

const PROD_API_BASE = 'https://api-mall.ideiasmkt.com.br/api/v1';
const DEV_API_BASE_WEB = 'http://localhost:3000/api/v1';
const DEV_API_BASE_ANDROID = 'http://10.0.2.2:3000/api/v1';

function resolveBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return DEV_API_BASE_WEB;
    }
    return PROD_API_BASE;
  }
  if (__DEV__) {
    return Platform.OS === 'android' ? DEV_API_BASE_ANDROID : DEV_API_BASE_WEB;
  }
  return PROD_API_BASE;
}

export const API_BASE_URL = resolveBaseUrl();

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
  retries?: number;
}

const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_RETRIES = 2;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * fetch com timeout, retry com backoff exponencial em falhas de rede e 5xx.
 * Lança ApiError para respostas não-2xx.
 */
export async function apiFetch<T = any>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers, timeoutMs = DEFAULT_TIMEOUT_MS, retries = DEFAULT_RETRIES } = options;

  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      const backoffMs = Math.min(500 * Math.pow(2, attempt - 1), 4000);
      await sleep(backoffMs);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(headers || {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        const status = response.status;
        // 4xx não se resolvem com retry (exceto 408/429)
        if (status >= 500 || status === 408 || status === 429) {
          lastError = new ApiError(`HTTP ${status}: ${response.statusText}`, status);
          continue;
        }
        throw new ApiError(`HTTP ${status}: ${response.statusText}`, status);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return (await response.json()) as T;
      }
      return (await response.text()) as unknown as T;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      const isAbort = err?.name === 'AbortError';
      lastError = new Error(isAbort ? `Timeout de ${timeoutMs}ms` : `Falha de rede: ${err?.message || err}`);
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error('Falha na requisição');
}
