/**
 * Contract for where the active session lives. In-memory adapter keeps it in
 * localStorage; an HTTP/auth backend would swap this for token storage.
 */
export interface SessionStore {
  current(): Promise<string | null>
  set(userId: string): Promise<void>
  clear(): Promise<void>
}
