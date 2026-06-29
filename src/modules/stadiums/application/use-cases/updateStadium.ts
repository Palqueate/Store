import type { StadiumRepository } from '../ports/StadiumRepository'
import type { Stadium } from '../../domain/Stadium'

/** Use case: update an existing stadium (admin). */
export function updateStadium(repo: StadiumRepository, stadium: Stadium): Promise<void> {
  return repo.update(stadium)
}
