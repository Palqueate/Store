// Routing + the palco-detail selection state, plus the detail view-model.
import { routerNavigate, pathForScreen } from '@/app/router/navigation'
import { eventOccurrences } from '@/modules/events/domain/Event'
import {
  palcoOccupancy, withCart, palcoYearAvailable, seatYearAvailable, seatEventAvailable,
  seatYearHasFree, seatEventHasFree,
} from '@/modules/palcos/domain/availability'

const scrollTop = () => { if (typeof window !== 'undefined') { try { window.scrollTo(0, 0) } catch (e) {} } }

export const createNavigationSlice = (set, get) => ({
  screen: 'home',
  pId: null as string | null,
  mode: 'palcoYear',
  eventId: 'e1',
  // Función (fecha + hora) elegida del evento. Para eventos de una sola fecha
  // coincide con el id del evento.
  occurrenceId: 'e1' as string | null,
  seats: [] as number[],
  // Lugares de estacionamiento elegidos para sumar a la reserva (0..disponibles).
  parkSel: 0,
  fromEvent: false,
  acctTab: 'compras',

  // Primera función de un evento (o null si el evento no existe).
  _firstOcc: (eid) => {
    const ev = get().events.find((e) => e.id === eid)
    if (!ev) return null
    const occs = eventOccurrences(ev)
    return occs[0] ? occs[0].id : null
  },

  go: (screen) => { set({ acctMenu: false }); routerNavigate(pathForScreen(screen, get())); scrollTop() },
  goEvents: () => get().go('events'),
  openEventPalcos: (id) => {
    // Al entrar a un evento se autoselecciona la primera función (fecha + hora).
    // Si tiene varias, el cliente puede cambiarla desde el selector.
    set({ eventId: id, occurrenceId: get()._firstOcc(id), seats: [] })
    get().go('eventPalcos')
  },
  selectPalco: (id) => {
    const p = get().byId(id); if (!p) return
    // Abre en la primera modalidad ACTIVA y con disponibilidad (RN-11); si
    // ninguna tiene cupo, cae en la primera activa para mostrarla agotada.
    const occ = withCart(palcoOccupancy(p), get().cart, p.id)
    const onModes = (['palcoYear', 'seatYear', 'seatEvent'] as const).filter((k) => p.modes[k] && p.modes[k].on)
    const isAvail = (k: string) => k === 'palcoYear' ? palcoYearAvailable(occ) : k === 'seatYear' ? seatYearHasFree(p, occ) : seatEventHasFree(p, occ)
    const defMode = onModes.find(isAvail) || onModes[0] || 'seatEvent'
    const ev = get().events.filter((e) => e.stadium === p.stadium)
    const eid = ev[0] ? ev[0].id : get().eventId
    set({ pId: id, mode: defMode, eventId: eid, occurrenceId: get()._firstOcc(eid), seats: [], parkSel: 0, food: [], snacksTarget: 'draft', fromEvent: false })
  },
  openDetail: (id) => { get().selectPalco(id); get().go('detail') },
  openDetailEvent: (pid, eid, occId) => { set({ pId: pid, mode: 'seatEvent', eventId: eid, occurrenceId: occId || get()._firstOcc(eid), seats: [], parkSel: 0, food: [], snacksTarget: 'draft', fromEvent: true }); get().go('detail') },
  setMode: (m) => set({ mode: m, seats: [] }),
  setEvent: (id) => set({ eventId: id, occurrenceId: get()._firstOcc(id), seats: [] }),
  // Elige la función (fecha + hora) dentro del evento actual.
  setOccurrence: (occId) => set({ occurrenceId: occId, seats: [] }),
  // Elige evento + función a la vez (selector de funciones en el detalle).
  setEventOccurrence: (eid, occId) => set({ eventId: eid, occurrenceId: occId, seats: [] }),
  toggleSeat: (n, st) => {
    if (st === 'taken' || get().mode === 'palcoYear') return
    const arr = get().seats.slice(); const i = arr.indexOf(n)
    if (i >= 0) arr.splice(i, 1); else arr.push(n)
    set({ seats: arr })
  },
  // Estacionamiento: elegir cuántos lugares sumar (clamp a los disponibles).
  setParkSel: (n) => {
    const p = get().byId(get().pId)
    const max = (p && p.parking.has) ? p.parking.n : 0
    set({ parkSel: Math.max(0, Math.min(max, n)) })
  },
  incParkSel: () => get().setParkSel((get().parkSel || 0) + 1),
  decParkSel: () => get().setParkSel((get().parkSel || 0) - 1),
  goAccount: (tab) => {
    const u = get().user
    set({
      acctTab: tab || 'compras', acctMenu: false,
      profileDraft: u ? { name: u.name, email: u.email, phone: u.phone || '', ci: u.ci || '', birth: u.birth || '', city: u.city || '', address: u.address || '', country: u.country || 'Uruguay' } : null,
    })
    get().go('account')
  },

  detailVM: () => {
    const s = get(); const p = get().byId(s.pId); if (!p) return null
    const markers = get().allPalcos().filter((q) => q.stadium === p.stadium && get().statusOf(q) !== 'pausado').map((q) => ({ x: q.map.x, y: q.map.y, active: q.id === p.id, label: q.id === p.id ? 'Tu palco' : '' }))
    // Ocupación cruzando modalidades (RN-11): lo sembrado + lo que ya hay en el
    // carrito para este palco, para que una reserva tape a las demás.
    const occ = withCart(palcoOccupancy(p), get().cart, p.id)
    const modeDefs = [
      { key: 'palcoYear', title: 'Palco entero', sub: 'Los ' + p.seats + ' asientos, por 1 año', term: '/año', on: p.modes.palcoYear.on, price: p.modes.palcoYear.price, available: palcoYearAvailable(occ) },
      { key: 'seatYear', title: 'Asiento anual', sub: 'Tu butaca toda la temporada', term: '/año · por asiento', on: p.modes.seatYear.on, price: p.modes.seatYear.price, available: seatYearHasFree(p, occ) },
      { key: 'seatEvent', title: 'Asiento por evento', sub: 'Una butaca para un evento puntual', term: '· por asiento', on: p.modes.seatEvent.on, price: p.modes.seatEvent.price, available: seatEventHasFree(p, occ) },
    ]
    // Estado de cada butaca según la modalidad elegida, ya cruzado entre modos.
    const seats: any[] = []
    for (let i = 1; i <= p.seats; i++) {
      ((n) => {
        let st: string
        if (s.mode === 'palcoYear') {
          // El palco entero exige TODAS las butacas libres en toda la temporada:
          // cualquier reserva (anual o por evento) marca la butaca como bloqueante.
          st = (occ.palcoYear || !seatYearAvailable(occ, n)) ? 'taken' : 'all'
        } else {
          const free = s.mode === 'seatYear' ? seatYearAvailable(occ, n) : seatEventAvailable(occ, n, s.occurrenceId)
          st = !free ? 'taken' : (s.seats.indexOf(n) >= 0 ? 'sel' : 'free')
        }
        seats.push({ n, st, click: () => get().toggleSeat(n, st) })
      })(i)
    }
    // Un "chip" por función (fecha + hora) de cada evento del estadio. Permite
    // elegir directamente la función desde el detalle del palco.
    const events: any[] = []
    get().events.filter((e) => e.stadium === p.stadium).forEach((e) => {
      eventOccurrences(e).forEach((o) => {
        events.push({ eventId: e.id, occId: o.id, opp: e.opp, tag: e.tag, day: o.day, month: o.month, dow: o.dow, time: o.time, selected: o.id === s.occurrenceId })
      })
    })
    let total = 0, qty = 0
    if (s.mode === 'palcoYear') { total = p.modes.palcoYear.price; qty = 1 }
    else if (s.mode === 'seatYear') { qty = s.seats.length; total = p.modes.seatYear.price * qty }
    else { qty = s.seats.length; total = p.modes.seatEvent.price * qty }
    // Estacionamiento como add-on: lugares elegidos × precio por lugar, sumado al total.
    const parkAvail = p.parking.has ? p.parking.n : 0
    const parkPrice = p.parking.has ? (p.parking.price || 0) : 0
    const parkSel = Math.max(0, Math.min(parkAvail, s.parkSel || 0))
    const parkTotal = parkSel * parkPrice
    total += parkTotal
    // ¿La modalidad elegida admite reservar ahora mismo? (RN-11)
    const modeAvailable = (modeDefs.find((m) => m.key === s.mode) || { available: true }).available
    return { p, markers, modeDefs, seats, events, total, qty, parkAvail, parkPrice, parkSel, parkTotal, modeAvailable }
  },
})
