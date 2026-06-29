import type { StadiumRepository } from '../application/ports/StadiumRepository'
import type { Stadium } from '../domain/Stadium'
import { STADIUMS } from '../../../shared/infrastructure/in-memory/db'
import { readJson, writeJson } from '../../../shared/infrastructure/storage/localStorage'

const KEY = 'pq_admin_stadiums'

/** Wraps the in-memory STADIUMS map; admin-created ones persist to localStorage. */
export class InMemoryStadiumRepository implements StadiumRepository {
  constructor() {
    // Rehydrate admin-created stadiums on construction, matching the prototype.
    for (const st of readJson<Stadium[]>(KEY, [])) {
      if (!STADIUMS[st.id]) STADIUMS[st.id] = st
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
    const stored = readJson<Stadium[]>(KEY, [])
    stored.push(stadium)
    writeJson(KEY, stored)
  }
}
