import type { StadiumRepository } from '../application/ports/StadiumRepository'
import type { Stadium } from '../domain/Stadium'
import { STADIUMS } from '../../../shared/infrastructure/in-memory/db'
import { readJson, writeJson } from '../../../shared/infrastructure/storage/localStorage'

const KEY = 'pq_admin_stadiums'

/** Wraps the in-memory STADIUMS map; admin changes persist to localStorage. */
export class InMemoryStadiumRepository implements StadiumRepository {
  constructor() {
    // Rehydrate persisted stadiums (admin-created AND admin-edited seeds) on
    // construction. Stored entries are the latest admin state, so they win.
    for (const st of readJson<Stadium[]>(KEY, [])) {
      STADIUMS[st.id] = st
    }
  }

  async list(): Promise<Stadium[]> {
    return Object.values(STADIUMS)
  }

  async findById(id: string): Promise<Stadium | null> {
    return STADIUMS[id] || null
  }

  async create(stadium: Stadium): Promise<void> {
    STADIUMS[stadium.id] = stadium
    this.persist(stadium)
  }

  async update(stadium: Stadium): Promise<void> {
    STADIUMS[stadium.id] = stadium
    this.persist(stadium)
  }

  /** Upsert the stadium into the persisted list by id. */
  private persist(stadium: Stadium): void {
    const stored = readJson<Stadium[]>(KEY, [])
    const i = stored.findIndex((s) => s.id === stadium.id)
    if (i >= 0) stored[i] = stadium
    else stored.push(stadium)
    writeJson(KEY, stored)
  }
}
