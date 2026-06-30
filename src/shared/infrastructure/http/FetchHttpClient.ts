import type { HttpClient } from '../../application/ports/HttpClient'

/**
 * Error de la API con código de estado y cuerpo ya parseado. Las repos y los
 * view-models pueden distinguir 401/403/404/409/5xx sin re-parsear la respuesta.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly method: string,
    readonly path: string,
    readonly body?: unknown,
  ) {
    super(`HTTP ${status} on ${method} ${path}`)
    this.name = 'ApiError'
  }
  get isUnauthorized() { return this.status === 401 }
  get isForbidden() { return this.status === 403 }
  get isNotFound() { return this.status === 404 }
  get isConflict() { return this.status === 409 }
  get isServer() { return this.status >= 500 }
}

/** Fallo de transporte: red caída, CORS, o timeout (request abortada). */
export class NetworkError extends Error {
  constructor(readonly method: string, readonly path: string, readonly timedOut: boolean, readonly cause?: unknown) {
    super(`${timedOut ? 'Timeout' : 'Network error'} on ${method} ${path}`)
    this.name = 'NetworkError'
  }
}

export interface FetchHttpClientOptions {
  /** Timeout por request en ms (por defecto 15000). */
  timeoutMs?: number
  /** Path del endpoint de refresh, relativo al baseUrl (por defecto '/auth/refresh'). */
  refreshPath?: string
}

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/** Lee una cookie legible por JS (p.ej. csrf_token; las httpOnly no se leen). */
function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const escaped = name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&')
  const m = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : null
}

/**
 * Transporte real contra la API remota. Implementa lo que el diseño de la API
 * exige (ver docs/API_ENDPOINTS.md §1.1):
 *   · `credentials: 'include'` para que viajen las cookies httpOnly de sesión.
 *   · Header `X-CSRF-Token` (double-submit) en mutaciones, con la cookie csrf_token.
 *   · Timeout por request vía AbortController.
 *   · Errores tipados: ApiError (HTTP) y NetworkError (transporte/timeout).
 *   · Refresh-on-401: ante un 401 reintenta una vez tras `POST /auth/refresh`,
 *     con single-flight para no disparar varios refresh en paralelo.
 * Apuntá `baseUrl` a la API y las repos que dependen de HttpClient empiezan a
 * hablar con ella sin más cambios.
 */
export class FetchHttpClient implements HttpClient {
  private readonly timeoutMs: number
  private readonly refreshPath: string
  private refreshing: Promise<boolean> | null = null

  constructor(private readonly baseUrl: string, opts: FetchHttpClientOptions = {}) {
    this.timeoutMs = opts.timeoutMs ?? 15000
    this.refreshPath = opts.refreshPath ?? '/auth/refresh'
  }

  private async raw(method: string, path: string, body: unknown, retryOnAuth: boolean): Promise<Response> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeoutMs)
    const headers: Record<string, string> = {}
    const hasBody = body !== undefined
    if (hasBody) headers['Content-Type'] = 'application/json'
    if (MUTATING.has(method)) {
      const csrf = readCookie('csrf_token')
      if (csrf) headers['X-CSRF-Token'] = csrf
    }

    let res: Response
    try {
      res = await fetch(this.baseUrl + path, {
        method,
        headers,
        credentials: 'include',
        body: hasBody ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })
    } catch (e) {
      const timedOut = e instanceof DOMException && e.name === 'AbortError'
      throw new NetworkError(method, path, timedOut, e)
    } finally {
      clearTimeout(timer)
    }

    // Ante un 401, intentar renovar la sesión una sola vez y reintentar.
    // Nunca para el propio endpoint de refresh (evita el bucle infinito).
    if (res.status === 401 && retryOnAuth && path !== this.refreshPath) {
      const refreshed = await this.ensureRefreshed()
      if (refreshed) return this.raw(method, path, body, false)
    }
    return res
  }

  /** Single-flight: un único refresh en vuelo aunque varias requests fallen a la vez. */
  private ensureRefreshed(): Promise<boolean> {
    if (!this.refreshing) {
      this.refreshing = this.raw('POST', this.refreshPath, undefined, false)
        .then((r) => r.ok)
        .catch(() => false)
        .finally(() => { this.refreshing = null })
    }
    return this.refreshing
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await this.raw(method, path, body, true)
    if (!res.ok) {
      let payload: unknown
      try { payload = await res.json() } catch { payload = undefined }
      throw new ApiError(res.status, method, path, payload)
    }
    if (res.status === 204) return undefined as T
    const text = await res.text()
    return (text ? JSON.parse(text) : undefined) as T
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
