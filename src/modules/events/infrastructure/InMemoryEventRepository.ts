import type { EventRepository } from '../application/ports/EventRepository'
import type { Ev } from '../domain/Event'
import { EVENTS } from '../../../shared/infrastructure/in-memory/db'
import { readJson, writeJson } from '../../../shared/infrastructure/storage/localStorage'

const KEY = 'pq_admin_events'

/** Wraps the in-memory EVENTS array; admin-created ones persist to localStorage. */
export class InMemoryEventRepository implements EventRepository {
  constructor() {
    for (const ev of readJson<Ev[]>(KEY, [])) {
      if (!EVENTS.some((x) => x.id === ev.id)) EVENTS.push(ev)
    }
  }

  async list(): Promise<Ev[]> {
    return EVENTS
  }

  async findById(id: string): Promise<Ev | null> {
    return EVENTS.find((e) => e.id === id) || null
  }

  async create(event: Ev): Promise<void> {
    EVENTS.push(event)
    const stored = readJson<Ev[]>(KEY, [])
    stored.push(event)
    writeJson(KEY, stored)
  }
}
