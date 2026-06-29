import type { PalcoRepository } from '../application/ports/PalcoRepository'
import type { Palco, PalcoStatus } from '../domain/Palco'
import type { HttpClient } from '../../../shared/application/ports/HttpClient'

/** API-backed palcos. Wire it in the container when the backend is ready. */
export class HttpPalcoRepository implements PalcoRepository {
  constructor(private readonly http: HttpClient) {}

  list(): Promise<Palco[]> {
    return this.http.get<Palco[]>('/palcos')
  }
  findById(id: string): Promise<Palco | null> {
    return this.http.get<Palco | null>(`/palcos/${id}`)
  }
  async publish(palco: Palco): Promise<void> {
    await this.http.post<void>('/palcos', palco)
  }
  async update(palco: Palco): Promise<void> {
    await this.http.put<void>(`/palcos/${palco.id}`, palco)
  }
  async setStatus(id: string, status: PalcoStatus): Promise<void> {
    await this.http.put<void>(`/palcos/${id}/status`, { status })
  }
}
