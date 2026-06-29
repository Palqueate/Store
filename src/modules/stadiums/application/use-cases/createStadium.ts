import type { StadiumRepository } from '../ports/StadiumRepository'
import type { Stadium } from '../../domain/Stadium'

/** Use case: create a new stadium (admin). */
export function createStadium(repo: StadiumRepository, stadium: Stadium): Promise<void> {
  return repo.create(stadium)
}
