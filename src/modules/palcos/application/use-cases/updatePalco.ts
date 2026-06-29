import type { PalcoRepository } from '../ports/PalcoRepository'
import type { Palco } from '../../domain/Palco'

/** Use case: update an existing palco edited by the owner wizard. */
export function updatePalco(repo: PalcoRepository, palco: Palco): Promise<void> {
  return repo.update(palco)
}
