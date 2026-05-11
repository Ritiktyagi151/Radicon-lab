import { getAdminToken } from './auth'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

type RequestOptions = RequestInit & {
  auth?: boolean
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.auth !== false) {
    const token = getAdminToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('backend-api-error', {
          detail: payload?.message || 'Request failed',
        }),
      )
    }
    throw new Error(payload?.message || 'Request failed')
  }

  return payload as T
}
