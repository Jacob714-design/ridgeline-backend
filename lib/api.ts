import { getSession } from 'next-auth/react';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function api<T>(
  url: string,
  options?: RequestInit & { noAuth?: boolean }
): Promise<T> {
  const { noAuth, ...fetchOptions } = options || {};
  
  const session = !noAuth ? await getSession() : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data.error || 'API request failed', data);
  }

  return data;
}

// Typed API methods
export const apiClient = {
  get: <T>(url: string, options?: RequestInit) => 
    api<T>(url, { ...options, method: 'GET' }),
  
  post: <T>(url: string, body?: any, options?: RequestInit) =>
    api<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  
  put: <T>(url: string, body?: any, options?: RequestInit) =>
    api<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  
  delete: <T>(url: string, options?: RequestInit) =>
    api<T>(url, { ...options, method: 'DELETE' }),
};