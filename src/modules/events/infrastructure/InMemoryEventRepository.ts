import type { EventRepository } from '../application/ports/EventRepository'
import type { Ev } from '../domain/Event'
import { EVENTS } from '../../../shared/infrastructure/in-memory/db'
import { readJson, writeJson } from '../../../shared/infrastructure/storage/localStorage'

const KEY = 'pq_admin_events'

/** Wraps the in-memory EVENTS array; admin-created AND admin-edited ones persist to localStorage. */
export class InMemoryEventRepository implements EventRepository {
  constructor() {
    // Rehydrate persisted events on construction. Stored entries are the latest
    // admin state (created or edited), so they overwrite matching seeds.
    for (const ev of readJson<Ev[]>(KEY, [])) {
      const i = EVENTS.findIndex((x) => x.id === ev.id)
      if (i >= 0) EVENTS[i] = ev
      else EVENTS.push(ev)
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
    this.persist(event)
  }

  async update(event: Ev): Promise<void> {
    const i = EVENTS.findIndex((e) => e.id === event.id)
    if (i >= 0) EVENTS[i] = event
    else EVENTS.push(event)
    this.persist(event)
  }

  /** Upsert the event into the persisted list by id. */
  private persist(event: Ev): void {
    const stored = readJson<Ev[]>(KEY, [])
    const i = stored.findIndex((e) => e.id === event.id)
    if (i >= 0) stored[i] = event
    else stored.push(event)
    writeJson(KEY, stored)
  }
}
