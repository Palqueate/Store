import type { EventRepository } from '../ports/EventRepository'
import type { Ev } from '../../domain/Event'

/** Use case: create a new event (admin). */
export function createEvent(repo: EventRepository, event: Ev): Promise<void> {
  return repo.create(event)
}
