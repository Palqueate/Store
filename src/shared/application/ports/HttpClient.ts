/**
 * Transport port for the future remote API. Repositories depend on THIS
 * interface, never on `fetch` directly, so swapping in-memory adapters for
 * HTTP adapters is a wiring change in the composition root — nothing else.
 */
export interface HttpClient {
  get<T>(path: string): Promise<T>
  post<T>(path: string, body: unknown): Promise<T>
  put<T>(path: string, body: unknown): Promise<T>
  delete<T>(path: string): Promise<T>
}
