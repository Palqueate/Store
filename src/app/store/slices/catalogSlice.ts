// @ts-nocheck
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

export const createCatalogSlice = (set, get) => ({
  stadiums: {},
  events: [],
  palcos: [],
  foodCatalog: [],
  foodCats: [],
  eventTypes: [],
  statusOver: {},

  // ---- bootstrap (was mount): load everything through the use cases ----
  bootstrap: async () => {
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
      const stadiumMap = {}
      stadiums.forEach((st) => { stadiumMap[st.id] = st })
      const user = sessionId ? (accounts.find((a) => a.id === sessionId) || null) : null
      set({ stadiums: stadiumMap, events, palcos, foodCatalog, foodCats, eventTypes: EVENT_TYPES, accounts, orders, user })
    } catch (e) {}
  },

  // ---- selectors over the catalog ----
  allPalcos: () => get().palcos,
  byId: (id) => get().allPalcos().find((p) => p.id === id),
  statusOf: (p) => get().statusOver[p.id] || p.status,
  eventFreeSeats: (p, eid) => { const t = (p.modes.seatEvent.taken && p.modes.seatEvent.taken[eid]) || []; return p.seats - t.length },
  palcoChips: (p) => {
    const c = [p.seats + ' asientos']
    if (p.parking.has) c.push('Estac. x' + p.parking.n); else c.push('Sin estac.')
    return c
  },
  fromPrice: (p) => {
    const m = p.modes; const opts = []
    if (m.seatEvent && m.seatEvent.on) opts.push({ v: m.seatEvent.price, l: 'desde · por evento' })
    if (m.seatYear && m.seatYear.on) opts.push({ v: m.seatYear.price, l: 'asiento / año' })
    if (m.palcoYear && m.palcoYear.on) opts.push({ v: m.palcoYear.price, l: 'palco / año' })
    opts.sort((a, b) => a.v - b.v)
    return opts[0] || { v: m.palcoYear.price, l: 'palco / año' }
  },
  filtered: () => {
    // Solo los palcos aprobados (disponibles) se muestran al público. Los que
    // están en revisión, rechazados o pausados quedan fuera del catálogo.
    const s = get(); let list = get().allPalcos().filter((p) => { const st = get().statusOf(p); return st === 'publicado' || st === 'alquilado' })
    if (s.fStadium !== 'all') list = list.filter((p) => p.stadium === s.fStadium)
    if (s.fType !== 'all') list = list.filter((p) => p.modes[s.fType] && p.modes[s.fType].on)
    if (s.fParking) list = list.filter((p) => p.parking.has)
    if (s.fMinSeats > 0) list = list.filter((p) => p.seats >= s.fMinSeats)
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
