import type { EventRepository } from '../application/ports/EventRepository'
import type { Ev } from '../domain/Event'
import type { HttpClient } from '../../../shared/application/ports/HttpClient'

/** API-backed events. Wire it in the container when the backend is ready. */
export class HttpEventRepository implements EventRepository {
  constructor(private readonly http: HttpClient) {}

  list(): Promise<Ev[]> {
    return this.http.get<Ev[]>('/events')
  }
  findById(id: string): Promise<Ev | null> {
    return this.http.get<Ev | null>(`/events/${id}`)
  }
  async create(event: Ev): Promise<void> {
    await this.http.post<void>('/events', event)
  }
}
