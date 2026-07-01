// Domain catalog: collections loaded from the repositories, plus the read
// selectors derived from them. bootstrap() is the old mount() data load.
import { container } from '@/app/container'
import { listPalcos } from '@/modules/palcos/application/use-cases/listPalcos'
import { listEvents } from '@/modules/events/application/use-cases/listEvents'
import { listStadiums } from '@/modules/stadiums/application/use-cases/listStadiums'
import { listFoodItems, listFoodCategories } from '@/modules/food/application/use-cases/listFoodCatalog'
import { listAccounts } from '@/modules/accounts/application/use-cases/accountUseCases'
import { listOrders } from '@/modules/orders/application/use-cases/orderUseCases'
import { getSession } from '@/modules/accounts/application/use-cases/accountUseCases'
import { publishPalco as publishPalcoUseCase } from '@/modules/palcos/application/use-cases/publishPalco'
import { updatePalco as updatePalcoUseCase } from '@/modules/palcos/application/use-cases/updatePalco'
import { EVENT_TYPES } from '@/shared/infrastructure/in-memory/db'
import { palcoOccupancy, withCart, freeSeatsForEvent } from '@/modules/palcos/domain/availability'
import type { Stadium } from '@/modules/stadiums/domain/Stadium'
import type { Ev, EventType } from '@/modules/events/domain/Event'
import type { Palco, PalcoStatus } from '@/modules/palcos/domain/Palco'
import type { FoodItem, FoodCat } from '@/modules/food/domain/Food'

export const createCatalogSlice = (set, get) => ({
  stadiums: {} as Record<string, Stadium>,
  events: [] as Ev[],
  palcos: [] as Palco[],
  foodCatalog: [] as FoodItem[],
  foodCats: [] as FoodCat[],
  eventTypes: [] as EventType[],
  statusOver: {} as Record<string, PalcoStatus>,
  // Estado de la carga inicial, para que la UI muestre carga / error + reintento.
  bootStatus: 'loading' as 'loading' | 'ready' | 'error',

  // ---- bootstrap (was mount): load everything through the use cases ----
  bootstrap: async () => {
    set({ bootStatus: 'loading' })
    try {
      const [stadiums, events, palcos, foodCatalog, foodCats, accounts, orders, sessionId] = await Promise.all([
        listStadiums(container.stadiums),
        listEvents(container.events),
        listPalcos(container.palcos),
        listFoodItems(container.food),
        listFoodCategories(container.food),
        listAccounts(container.accounts),
        listOrders(container.orders),
        getSession(container.session),
      ])
      const stadiumMap: Record<string, Stadium> = {}
      stadiums.forEach((st) => { stadiumMap[st.id] = st })
      const user = sessionId ? (accounts.find((a) => a.id === sessionId) || null) : null
      set({ stadiums: stadiumMap, events, palcos, foodCatalog, foodCats, eventTypes: EVENT_TYPES, accounts, orders, user, bootStatus: 'ready' })
    } catch (e) {
      console.error('[palqueate] bootstrap failed', e)
      set({ bootStatus: 'error' })
    }
  },

  // ---- selectors over the catalog ----
  allPalcos: () => get().palcos,
  byId: (id) => get().allPalcos().find((p) => p.id === id),
  statusOf: (p) => get().statusOver[p.id] || p.status,
  // Butacas libres para una función: descuenta lo tomado en ESA función, sumando
  // también lo que el carrito ya reservó para ese palco.
  eventFreeSeats: (p, eid) => freeSeatsForEvent(p, withCart(palcoOccupancy(p), get().cart, p.id), eid),
  // Precio "desde": la única modalidad es "asiento por evento". Lo usan los
  // paneles de dueño y admin.
  fromPrice: (p) => ({ v: p.modes.seatEvent.price, l: 'desde · por evento' }),

  // ---- owner publish status (local override) ----
  togglePublish: (id) => {
    const p = get().byId(id); if (!p) return
    const cur = get().statusOf(p)
    if (cur === 'alquilado') return get().flash('No se puede pausar: el palco está alquilado')
    const ns = cur === 'pausado' ? 'publicado' : 'pausado'
    set({ statusOver: { ...get().statusOver, [id]: ns } })
    get().flash(ns === 'pausado' ? 'Publicación pausada' : 'Publicación reactivada')
  },
  publishPalcoEntity: (np) => publishPalcoUseCase(container.palcos, np),
  updatePalcoEntity: (np) => updatePalcoUseCase(container.palcos, np),
  // Persist an edited palco into both the entity store and the catalog array,
  // dropping any transient status override for that id.
  savePalco: (np) => {
    get().updatePalcoEntity(np)
    const over = { ...get().statusOver }; delete over[np.id]
    set({ palcos: get().palcos.map((p) => (p.id === np.id ? np : p)), statusOver: over })
  },
})
