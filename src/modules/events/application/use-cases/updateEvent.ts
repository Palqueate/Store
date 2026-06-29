import type { EventRepository } from '../ports/EventRepository'
import type { Ev } from '../../domain/Event'

/** Use case: update an existing event (admin). */
export function updateEvent(repo: EventRepository, event: Ev): Promise<void> {
  return repo.update(event)
}
