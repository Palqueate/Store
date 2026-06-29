import type { AccountRepository } from '../ports/AccountRepository'
import type { SessionStore } from '../ports/SessionStore'
import type { User } from '../../domain/User'

/** Use case: list all accounts. */
export function listAccounts(repo: AccountRepository): Promise<User[]> {
  return repo.list()
}

/** Use case: create or update an account. */
export function saveAccount(repo: AccountRepository, account: User): Promise<void> {
  return repo.save(account)
}

/** Use case: read the active session's user id. */
export function getSession(store: SessionStore): Promise<string | null> {
  return store.current()
}

/** Use case: persist the active session. */
export function setSession(store: SessionStore, userId: string): Promise<void> {
  return store.set(userId)
}

/** Use case: end the active session. */
export function clearSession(store: SessionStore): Promise<void> {
  return store.clear()
}
