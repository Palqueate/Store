import type { SessionStore } from '../application/ports/SessionStore'
import { readString, writeString } from '../../../shared/infrastructure/storage/localStorage'

const KEY = 'pq_session'

/** Session id persisted in localStorage, matching the prototype's `pq_session`. */
export class LocalStorageSessionStore implements SessionStore {
  async current(): Promise<string | null> {
    return readString(KEY)
  }

  async set(userId: string): Promise<void> {
    writeString(KEY, userId)
  }

  async clear(): Promise<void> {
    writeString(KEY, null)
  }
}
