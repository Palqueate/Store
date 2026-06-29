import type { StadiumRepository } from '../ports/StadiumRepository'
import type { Stadium } from '../../domain/Stadium'

/** Use case: list all stadiums. Depends only on the port. */
export function listStadiums(repo: StadiumRepository): Promise<Stadium[]> {
  return repo.list()
}
