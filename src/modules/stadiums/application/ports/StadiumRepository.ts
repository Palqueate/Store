import type { Stadium } from '../../domain/Stadium'

/** Persistence contract for stadiums. Async so an HTTP adapter is a drop-in. */
export interface StadiumRepository {
  list(): Promise<Stadium[]>
  findById(id: string): Promise<Stadium | null>
  create(stadium: Stadium): Promise<void>
}
