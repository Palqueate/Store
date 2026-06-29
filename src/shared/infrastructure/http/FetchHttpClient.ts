import type { HttpClient } from '../../application/ports/HttpClient'

/**
 * Real transport adapter for the remote API. Stubbed for now — the app runs
 * fully in-memory, so this is the seam you flesh out the day the backend
 * exists. Point `baseUrl` at the API and the repository adapters that depend
 * on HttpClient start talking to it without further changes.
 */
export class FetchHttpClient implements HttpClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(this.baseUrl + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} on ${method} ${path}`)
    return (await res.json()) as T
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path)
  }
  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>('POST', path, body)
  }
  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>('PUT', path, body)
  }
  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path)
  }
}
