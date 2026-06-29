// ============================================================
// PALQUEATE · composition root
// This is THE swap point. Every repository is built here behind its port
// interface. Today they resolve to in-memory adapters; the day the backend
// exists, flip DATA_SOURCE to 'http' (and set API_BASE_URL) — no consumer
// changes, because consumers depend on the port interfaces, not the adapters.
// ============================================================
import type { StadiumRepository } from '../modules/stadiums/application/ports/StadiumRepository'
import type { EventRepository } from '../modules/events/application/ports/EventRepository'
import type { PalcoRepository } from '../modules/palcos/application/ports/PalcoRepository'
import type { FoodRepository } from '../modules/food/application/ports/FoodRepository'
import type { AccountRepository } from '../modules/accounts/application/ports/AccountRepository'
import type { SessionStore } from '../modules/accounts/application/ports/SessionStore'
import type { OrderRepository } from '../modules/orders/application/ports/OrderRepository'
import type { HttpClient } from '../shared/application/ports/HttpClient'

import { InMemoryStadiumRepository } from '../modules/stadiums/infrastructure/InMemoryStadiumRepository'
import { InMemoryEventRepository } from '../modules/events/infrastructure/InMemoryEventRepository'
import { InMemoryPalcoRepository } from '../modules/palcos/infrastructure/InMemoryPalcoRepository'
import { InMemoryFoodRepository } from '../modules/food/infrastructure/InMemoryFoodRepository'
import { InMemoryAccountRepository } from '../modules/accounts/infrastructure/InMemoryAccountRepository'
import { LocalStorageSessionStore } from '../modules/accounts/infrastructure/LocalStorageSessionStore'
import { InMemoryOrderRepository } from '../modules/orders/infrastructure/InMemoryOrderRepository'

import { HttpStadiumRepository } from '../modules/stadiums/infrastructure/HttpStadiumRepository'
import { HttpEventRepository } from '../modules/events/infrastructure/HttpEventRepository'
import { HttpPalcoRepository } from '../modules/palcos/infrastructure/HttpPalcoRepository'
import { HttpFoodRepository } from '../modules/food/infrastructure/HttpFoodRepository'
import { HttpAccountRepository } from '../modules/accounts/infrastructure/HttpAccountRepository'
import { HttpOrderRepository } from '../modules/orders/infrastructure/HttpOrderRepository'
import { FetchHttpClient } from '../shared/infrastructure/http/FetchHttpClient'

export interface Container {
  stadiums: StadiumRepository
  events: EventRepository
  palcos: PalcoRepository
  food: FoodRepository
  accounts: AccountRepository
  session: SessionStore
  orders: OrderRepository
}

// ---- the only line you change to go live against the API ----
const DATA_SOURCE = 'memory' as 'memory' | 'http'
const API_BASE_URL = '/api'

function buildHttp(): Container {
  const http: HttpClient = new FetchHttpClient(API_BASE_URL)
  return {
    stadiums: new HttpStadiumRepository(http),
    events: new HttpEventRepository(http),
    palcos: new HttpPalcoRepository(http),
    food: new HttpFoodRepository(http),
    accounts: new HttpAccountRepository(http),
    session: new LocalStorageSessionStore(), // session storage stays local
    orders: new HttpOrderRepository(http),
  }
}

function buildMemory(): Container {
  return {
    stadiums: new InMemoryStadiumRepository(),
    events: new InMemoryEventRepository(),
    palcos: new InMemoryPalcoRepository(),
    food: new InMemoryFoodRepository(),
    accounts: new InMemoryAccountRepository(),
    session: new LocalStorageSessionStore(),
    orders: new InMemoryOrderRepository(),
  }
}

/** Singleton container wired for the current DATA_SOURCE. */
export const container: Container = DATA_SOURCE === 'http' ? buildHttp() : buildMemory()
