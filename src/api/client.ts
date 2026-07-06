import type { CheckoutRequest, Product, Transaction } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8123'

export class ApiError extends Error {
  readonly status: number
  readonly detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!res.ok) {
    let detail = `Request failed with status ${res.status}`
    try {
      const body = await res.json()
      if (typeof body.detail === 'string') detail = body.detail
    } catch {
      // non-JSON error body — keep the generic message
    }
    throw new ApiError(res.status, detail)
  }

  return res.json() as Promise<T>
}

export function getProducts(params?: {
  include_inactive?: boolean
  limit?: number
  offset?: number
}): Promise<Product[]> {
  const query = new URLSearchParams()
  if (params?.include_inactive) query.set('include_inactive', 'true')
  if (params?.limit !== undefined) query.set('limit', String(params.limit))
  if (params?.offset !== undefined) query.set('offset', String(params.offset))
  const qs = query.toString()
  return request<Product[]>(`/products${qs ? `?${qs}` : ''}`)
}

export function checkout(body: CheckoutRequest): Promise<Transaction> {
  return request<Transaction>('/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * Dev-only scan simulation. The production kiosk never calls this —
 * real scans come from the ESP32 and arrive over the WebSocket.
 */
export function simulateScan(tagId: string): Promise<Product> {
  return request<Product>('/scan', {
    method: 'POST',
    headers: { 'X-API-Key': 'dev-secret-key' },
    body: JSON.stringify({ tag_id: tagId }),
  })
}
