import type { AccountRepository } from '../application/ports/AccountRepository'
import type { User } from '../domain/User'
import type { HttpClient } from '../../../shared/application/ports/HttpClient'

/** API-backed accounts. Wire it in the container when the backend is ready. */
export class HttpAccountRepository implements AccountRepository {
  constructor(private readonly http: HttpClient) {}

  list(): Promise<User[]> {
    return this.http.get<User[]>('/accounts')
  }
  findById(id: string): Promise<User | null> {
    return this.http.get<User | null>(`/accounts/${id}`)
  }
  findByEmail(email: string): Promise<User | null> {
    return this.http.get<User | null>(`/accounts?email=${encodeURIComponent(email)}`)
  }
  async save(account: User): Promise<void> {
    await this.http.put<void>(`/accounts/${account.id}`, account)
  }
}
