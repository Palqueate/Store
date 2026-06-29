import type { EventRepository } from '../ports/EventRepository'
import type { Ev } from '../../domain/Event'

/** Use case: list all events. Depends only on the port. */
export function listEvents(repo: EventRepository): Promise<Ev[]> {
  return repo.list()
}
