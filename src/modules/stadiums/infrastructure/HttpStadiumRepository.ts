import type { StadiumRepository } from '../application/ports/StadiumRepository'
import type { Stadium } from '../domain/Stadium'
import type { HttpClient } from '../../../shared/application/ports/HttpClient'

/** API-backed stadiums. Wire it in the container when the backend is ready. */
export class HttpStadiumRepository implements StadiumRepository {
  constructor(private readonly http: HttpClient) {}

  list(): Promise<Stadium[]> {
    return this.http.get<Stadium[]>('/stadiums')
  }
  findById(id: string): Promise<Stadium | null> {
    return this.http.get<Stadium | null>(`/stadiums/${id}`)
  }
  async create(stadium: Stadium): Promise<void> {
    await this.http.post<void>('/stadiums', stadium)
  }
}
