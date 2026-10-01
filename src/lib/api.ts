export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function getStoredSessionToken(): string | null {
  return localStorage.getItem('deal_token');
}

export function setStoredSessionToken(token: string): void {
  localStorage.setItem('deal_token', token);
}

export function clearStoredSession(): void {
  localStorage.removeItem('deal_token');
  localStorage.removeItem('deal_session');
}

export interface ApiFetchOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T = any>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = options.token !== undefined ? options.token : getStoredSessionToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-deal-token'] = token;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers
    });
  } catch (err: any) {
    throw new Error('Server temporarily unavailable. Please check your internet connection or try again.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredSession();
      throw new Error(data.error || 'Session expired. Please sign in again.');
    }
    if (response.status === 403) {
      throw new Error(data.error || '403 — Access Denied. Insufficient administrative permissions.');
    }
    throw new Error(data.error || 'Operation failed. Please try again.');
  }

  return data as T;
}
