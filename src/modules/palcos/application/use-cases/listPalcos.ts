import type { PalcoRepository } from '../ports/PalcoRepository'
import type { Palco } from '../../domain/Palco'

/**
 * Use case: list all palcos. The application layer the UI/store talks to —
 * it depends only on the port, so the data source (in-memory today, HTTP
 * tomorrow) is irrelevant here. Swap happens in the composition root.
 */
export function listPalcos(repo: PalcoRepository): Promise<Palco[]> {
  return repo.list()
}
