import type { AccountRepository } from '../application/ports/AccountRepository'
import type { User } from '../domain/User'
import { SEED_USER } from '../../../shared/infrastructure/in-memory/db'
import { readJson, writeJson } from '../../../shared/infrastructure/storage/localStorage'

const KEY = 'pq_accounts'

/**
 * Accounts persisted in localStorage. Seeds/merges the demo account on first
 * read, mirroring the prototype's mount() so existing data keeps working.
 */
export class InMemoryAccountRepository implements AccountRepository {
  private load(): User[] {
    let accs = readJson<User[]>(KEY, [])
    if (!accs.some((a) => a.id === SEED_USER.id)) {
      accs = accs.concat([SEED_USER])
    } else {
      accs = accs.map((a) =>
        a.id === SEED_USER.id
          ? { ...SEED_USER, ...a, notif: { ...SEED_USER.notif, ...(a.notif || {}) }, card: { ...SEED_USER.card, ...(a.card || {}) } }
          : a,
      )
    }
    writeJson(KEY, accs)
    return accs
  }

  async list(): Promise<User[]> {
    return this.load()
  }

  async findById(id: string): Promise<User | null> {
    return this.load().find((a) => a.id === id) || null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.load().find((a) => a.email === email) || null
  }

  async save(account: User): Promise<void> {
    const accs = this.load()
    const idx = accs.findIndex((a) => a.id === account.id)
    if (idx >= 0) accs[idx] = account
    else accs.push(account)
    writeJson(KEY, accs)
  }
}
