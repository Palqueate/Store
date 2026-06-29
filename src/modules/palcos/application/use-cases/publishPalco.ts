import type { PalcoRepository } from '../ports/PalcoRepository'
import type { Palco } from '../../domain/Palco'

/** Use case: publish a new palco built by the owner wizard. */
export function publishPalco(repo: PalcoRepository, palco: Palco): Promise<void> {
  return repo.publish(palco)
}
