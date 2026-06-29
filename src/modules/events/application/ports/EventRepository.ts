import type { Ev } from '../../domain/Event'

/** Persistence contract for events. Async so an HTTP adapter is a drop-in. */
export interface EventRepository {
  list(): Promise<Ev[]>
  findById(id: string): Promise<Ev | null>
  create(event: Ev): Promise<void>
}
