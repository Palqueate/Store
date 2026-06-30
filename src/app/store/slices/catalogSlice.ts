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
  // Butacas libres para una función: descuenta lo tomado en ESA función y también
  // lo anual / palco-entero, que tapa la butaca en todos los eventos (RN-11).
  eventFreeSeats: (p, eid) => freeSeatsForEvent(p, withCart(palcoOccupancy(p), get().cart, p.id), eid),
  palcoChips: (p) => {
    const c = [p.seats + ' asientos']
    if (p.parking.has) c.push('Estac. x' + p.parking.n); else c.push('Sin estac.')
    return c
  },
  fromPrice: (p) => {
    const m = p.modes; const opts: { v: number; l: string }[] = []
    if (m.seatEvent && m.seatEvent.on) opts.push({ v: m.seatEvent.price, l: 'desde · por evento' })
    if (m.seatYear && m.seatYear.on) opts.push({ v: m.seatYear.price, l: 'asiento / año' })
    if (m.palcoYear && m.palcoYear.on) opts.push({ v: m.palcoYear.price, l: 'palco / año' })
    opts.sort((a, b) => a.v - b.v)
    return opts[0] || { v: m.palcoYear.price, l: 'palco / año' }
  },
  // Palcos visibles al público (aprobados o ya alquilados). Base de los filtros
  // y del rango de precios.
  publicPalcos: () => get().allPalcos().filter((p) => { const st = get().statusOf(p); return st === 'publicado' || st === 'alquilado' }),
  // Rango de precios "desde" sobre los palcos públicos, redondeado a múltiplos
  // de 500 para que los sliders caigan en valores prolijos. Si no hay palcos,
  // devuelve un rango neutro.
  priceBounds: () => {
    const prices = get().publicPalcos().map((p) => get().fromPrice(p).v)
    if (!prices.length) return { lo: 0, hi: 0, step: 500 }
    const lo = Math.floor(Math.min(...prices) / 500) * 500
    const hi = Math.ceil(Math.max(...prices) / 500) * 500
    return { lo, hi: hi > lo ? hi : lo + 500, step: 500 }
  },
  filtered: () => {
    // Solo los palcos aprobados (disponibles) se muestran al público. Los que
    // están en revisión, rechazados o pausados quedan fuera del catálogo.
    const s = get(); let list = get().publicPalcos()
    if (s.fQuery && s.fQuery.trim()) {
      const q = s.fQuery.trim().toLowerCase()
      list = list.filter((p) => {
        const st = get().stadiums[p.stadium]
        const hay = [p.title, p.sector, p.host, st && st.name, st && st.short].filter(Boolean).join(' ').toLowerCase()
        return hay.includes(q)
      })
    }
    if (s.fStadiums && s.fStadiums.length) list = list.filter((p) => s.fStadiums.indexOf(p.stadium) >= 0)
    if (s.fType !== 'all') list = list.filter((p) => p.modes[s.fType] && p.modes[s.fType].on)
    if (s.fParking) list = list.filter((p) => p.parking.has)
    if (s.fMinSeats > 0) list = list.filter((p) => p.seats >= s.fMinSeats)
    if (s.fMinPrice > 0) list = list.filter((p) => get().fromPrice(p).v >= s.fMinPrice)
    if (s.fMaxPrice > 0) list = list.filter((p) => get().fromPrice(p).v <= s.fMaxPrice)
    if (s.sort === 'price') list = list.slice().sort((a, b) => get().fromPrice(a).v - get().fromPrice(b).v)
    if (s.sort === 'seats') list = list.slice().sort((a, b) => b.seats - a.seats)
    if (s.sort === 'rating') list = list.slice().sort((a, b) => b.rating - a.rating)
    return list
  },
  cardVM: (p) => {
    const fp = get().fromPrice(p)
    return {
      id: p.id, title: p.title, sector: p.sector, rating: p.rating.toFixed(1),
      stadiumShort: get().stadiums[p.stadium].short, chips: get().palcoChips(p),
      priceText: get().money(fp.v), priceLabel: fp.l.toUpperCase(),
      open: () => get().openDetail(p.id),
    }
  },

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
