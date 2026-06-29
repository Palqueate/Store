import type { User } from '../../domain/User'

/** Persistence contract for user accounts. Async so an HTTP adapter is a drop-in. */
export interface AccountRepository {
  list(): Promise<User[]>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  save(account: User): Promise<void>
}
