// @ts-nocheck
// Routing + the palco-detail selection state, plus the detail view-model.
import { routerNavigate, pathForScreen } from '@/app/router/navigation'

const scrollTop = () => { if (typeof window !== 'undefined') { try { window.scrollTo(0, 0) } catch (e) {} } }

export const createNavigationSlice = (set, get) => ({
  screen: 'home',
  pId: null,
  mode: 'palcoYear',
  eventId: 'e1',
  seats: [],
  fromEvent: false,
  acctTab: 'compras',

  go: (screen) => { set({ acctMenu: false }); routerNavigate(pathForScreen(screen, get())); scrollTop() },
  goEvents: () => get().go('events'),
  openEventPalcos: (id) => { set({ eventId: id }); get().go('eventPalcos') },
  selectPalco: (id) => {
    const p = get().byId(id); if (!p) return
    const defMode = (p.modes.palcoYear && p.modes.palcoYear.on) ? 'palcoYear' : (p.modes.seatYear && p.modes.seatYear.on) ? 'seatYear' : 'seatEvent'
    const ev = get().events.filter((e) => e.stadium === p.stadium)
    set({ pId: id, mode: defMode, eventId: ev[0] ? ev[0].id : get().eventId, seats: [], fromEvent: false })
  },
  openDetail: (id) => { get().selectPalco(id); get().go('detail') },
  openDetailEvent: (pid, eid) => { set({ pId: pid, mode: 'seatEvent', eventId: eid, seats: [], fromEvent: true }); get().go('detail') },
  setMode: (m) => set({ mode: m, seats: [] }),
  setEvent: (id) => set({ eventId: id, seats: [] }),
  toggleSeat: (n, st) => {
    if (st === 'taken' || get().mode === 'palcoYear') return
    const arr = get().seats.slice(); const i = arr.indexOf(n)
    if (i >= 0) arr.splice(i, 1); else arr.push(n)
    set({ seats: arr })
  },
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
    const modeDefs = [
      { key: 'palcoYear', title: 'Palco entero', sub: 'Los ' + p.seats + ' asientos, por 1 año', term: '/año', on: p.modes.palcoYear.on, price: p.modes.palcoYear.price },
      { key: 'seatYear', title: 'Asiento anual', sub: 'Tu butaca toda la temporada', term: '/año · por asiento', on: p.modes.seatYear.on, price: p.modes.seatYear.price },
      { key: 'seatEvent', title: 'Asiento por evento', sub: 'Una butaca para un evento puntual', term: '· por asiento', on: p.modes.seatEvent.on, price: p.modes.seatEvent.price },
    ]
    let taken = []
    if (s.mode === 'seatYear') taken = p.modes.seatYear.taken || []
    else if (s.mode === 'seatEvent') taken = (p.modes.seatEvent.taken && p.modes.seatEvent.taken[s.eventId]) || []
    const seats = []
    for (let i = 1; i <= p.seats; i++) {
      ((n) => {
        const st = s.mode === 'palcoYear' ? 'all' : (taken.indexOf(n) >= 0 ? 'taken' : (s.seats.indexOf(n) >= 0 ? 'sel' : 'free'))
        seats.push({ n, st, click: () => get().toggleSeat(n, st) })
      })(i)
    }
    const events = get().events.filter((e) => e.stadium === p.stadium).map((e) => Object.assign({}, e, { selected: e.id === s.eventId }))
    let total = 0, qty = 0
    if (s.mode === 'palcoYear') { total = p.modes.palcoYear.price; qty = 1 }
    else if (s.mode === 'seatYear') { qty = s.seats.length; total = p.modes.seatYear.price * qty }
    else { qty = s.seats.length; total = p.modes.seatEvent.price * qty }
    return { p, markers, modeDefs, seats, events, total, qty }
  },
})
