import type { PalcoRepository } from '../application/ports/PalcoRepository'
import type { Palco, PalcoStatus } from '../domain/Palco'
import { PALCOS } from '../../../shared/infrastructure/in-memory/db'

/** Wraps the in-memory PALCOS array. */
export class InMemoryPalcoRepository implements PalcoRepository {
  async list(): Promise<Palco[]> {
    return PALCOS
  }

  async findById(id: string): Promise<Palco | null> {
    return PALCOS.find((p) => p.id === id) || null
  }

  async publish(palco: Palco): Promise<void> {
    PALCOS.push(palco)
  }

  async setStatus(id: string, status: PalcoStatus): Promise<void> {
    const palco = PALCOS.find((p) => p.id === id)
    if (palco) palco.status = status
  }
}
