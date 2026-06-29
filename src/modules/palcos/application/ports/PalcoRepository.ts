import type { Palco, PalcoStatus } from '../../domain/Palco'

/** Persistence contract for palcos. Async so an HTTP adapter is a drop-in. */
export interface PalcoRepository {
  list(): Promise<Palco[]>
  findById(id: string): Promise<Palco | null>
  publish(palco: Palco): Promise<void>
  setStatus(id: string, status: PalcoStatus): Promise<void>
}
