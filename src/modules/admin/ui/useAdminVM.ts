import { useFacade } from '@/shared/ui/vm/facade'
import { evTagStyle, statusBadge } from '@/shared/ui/vm/helpers'
import { eventOccurrences } from '@/modules/events/domain/Event'

export function useAdminVM(): any {
  const self = useFacade()
  const s = self.state

  var STADIUMS = s.stadiums, EVENTS = s.events, EVENT_TYPES = s.eventTypes
  var mobile = s.vw < 860


  function stad(id) { return STADIUMS[id] || { name: id, short: (id || '?').slice(0, 3).toUpperCase(), city: '' } }

  var ALL_PALCOS = self.allPalcos()
  var STAD_LIST = Object.keys(STADIUMS).map(function (k) { return STADIUMS[k] })
  var ordersAll = s.orders

  var gmv = ordersAll.reduce(function (a, o) { return a + (o.total || 0) + (o.foodTotal || 0) }, 0)
  var commission = ordersAll.reduce(function (a, o) { return a + (o.fee || 0) }, 0)
  var ticketsSold = ordersAll.reduce(function (a, o) { return a + o.items.reduce(function (x, it) { return x + (it.mode === 'palcoYear' ? 1 : (it.seats ? it.seats.length : (it.qty || 1))) }, 0) }, 0)
  var avgTicket = ordersAll.length ? Math.round(gmv / ordersAll.length) : 0
  var activePalcos = ALL_PALCOS.filter(function (p) { return self.statusOf(p) !== 'pausado' }).length
  var foodRev = ordersAll.reduce(function (a, o) { return a + (o.foodTotal || 0) }, 0)
  var payout = Math.max(0, gmv - commission)
  var occVals = ALL_PALCOS.map(function (p) { var cap = p.modes.seatYear.on ? p.seats : 0; var tk = (p.modes.seatYear.on && p.modes.seatYear.taken) ? p.modes.seatYear.taken.length : 0; return cap > 0 ? tk / cap : null }).filter(function (x) { return x != null })
  var occAvg = occVals.length ? Math.round(occVals.reduce(function (a, b) { return a + b }, 0) / occVals.length * 100) : 0

  var adminKpis = [
    { label: 'GMV · VENTAS', value: self.money(gmv), sub: ordersAll.length + ' reservas', accent: true },
    { label: 'COMISIÓN PALQUEATE', value: self.money(commission), sub: '4% s/ reservas' },
    { label: 'PAYOUT A PALQUISTAS', value: self.money(payout), sub: 'neto a dueños' },
    { label: 'INGRESO BOTANA', value: self.money(foodRev), sub: 'comidas y bebidas' },
    { label: 'ENTRADAS VENDIDAS', value: String(ticketsSold), sub: 'butacas + palcos' },
    { label: 'TICKET PROMEDIO', value: self.money(avgTicket), sub: 'por reserva' },
    { label: 'CLIENTES', value: String(s.accounts.length), sub: 'cuentas registradas' },
    { label: 'OCUPACIÓN MEDIA', value: occAvg + '%', sub: 'asientos anuales' },
    { label: 'PALCOS ACTIVOS', value: activePalcos + '/' + ALL_PALCOS.length, sub: 'publicados' },
    { label: 'EVENTOS · ESTADIOS', value: EVENTS.length + ' · ' + STAD_LIST.length, sub: 'en plataforma' },
  ]

  var revByStad = {}; STAD_LIST.forEach(function (st) { revByStad[st.id] = 0 })
  ordersAll.forEach(function (o) { o.items.forEach(function (it) { if (revByStad[it.stadium] == null) revByStad[it.stadium] = 0; revByStad[it.stadium] += it.price }) })
  var revStadMax = Math.max.apply(null, STAD_LIST.map(function (st) { return revByStad[st.id] || 0 }).concat([1]))
  var adminRevStad = STAD_LIST.map(function (st) { var v = revByStad[st.id] || 0; return { name: st.name, val: self.money(v), fill: { height: '10px', width: Math.max(2, Math.round(v / revStadMax * 100)) + '%', background: 'var(--primary,#C9A24B)', borderRadius: '6px' } } })

  var adminRecent = ordersAll.slice().reverse().slice(0, 6).map(function (o) { var acct = s.accounts.find(function (a) { return a.id === o.userId }); return { code: o.code, client: acct ? acct.name : ((o.contact && o.contact.name) || '—'), total: self.money((o.total || 0) + (o.foodTotal || 0)), when: (function () { try { return new Date(o.date).toLocaleDateString('es-UY', { day: '2-digit', month: 'short' }) } catch (e) { return '' } })() } })

  var monthsLbl = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN']
  var seedBase = Math.max(90000, Math.round(gmv * 0.5))
  var monthSales = monthsLbl.map(function (m, i) { var f = 0.55 + (((i * 53 + 17) % 40) / 100) + i * 0.07; return Math.round(seedBase * f) })
  var monthMax = monthSales.reduce(function (a, b) { return Math.max(a, b) }, 1)
  var adminMonthBars = monthSales.map(function (v, i) { return { mo: monthsLbl[i], val: self.money(v), barStyle: 'width:100%; height:' + Math.max(8, Math.round(v / monthMax * 100)) + '%; border-radius:5px 5px 2px 2px; background:linear-gradient(180deg, var(--primary,#C9A24B), color-mix(in srgb,var(--primary,#C9A24B) 45%, transparent));' } })

  var modeRev = { palcoYear: 0, seatYear: 0, seatEvent: 0 }
  ordersAll.forEach(function (o) { o.items.forEach(function (it) { if (modeRev[it.mode] != null) modeRev[it.mode] += it.price }) })
  var modeTotal = (modeRev.palcoYear + modeRev.seatYear + modeRev.seatEvent) || 1
  var pPalco = Math.round(modeRev.palcoYear / modeTotal * 100), pSeatY = Math.round(modeRev.seatYear / modeTotal * 100), pSeatE = Math.max(0, 100 - pPalco - pSeatY)
  var adminDonut = { width: '132px', height: '132px', borderRadius: '50%', flex: '0 0 auto', background: 'conic-gradient(var(--primary,#C9A24B) 0 ' + pPalco + '%, var(--success,#34D17E) ' + pPalco + '% ' + (pPalco + pSeatY) + '%, var(--warning,#E5A94D) ' + (pPalco + pSeatY) + '% 100%)' }
  var adminModality = [{ label: 'Palco anual', pct: pPalco + '%', val: self.money(modeRev.palcoYear), dot: { width: '10px', height: '10px', borderRadius: '3px', background: 'var(--primary,#C9A24B)', flex: '0 0 auto' } }, { label: 'Asiento anual', pct: pSeatY + '%', val: self.money(modeRev.seatYear), dot: { width: '10px', height: '10px', borderRadius: '3px', background: 'var(--success,#34D17E)', flex: '0 0 auto' } }, { label: 'Por evento', pct: pSeatE + '%', val: self.money(modeRev.seatEvent), dot: { width: '10px', height: '10px', borderRadius: '3px', background: 'var(--warning,#E5A94D)', flex: '0 0 auto' } }]

  // Mapa función (occurrence id) → evento, para acumular ingresos por evento
  // aunque la disponibilidad esté indexada por función (fecha + hora).
  var occToEvent = {}; EVENTS.forEach(function (e) { eventOccurrences(e).forEach(function (o) { occToEvent[o.id] = e.id }) })
  var evRevMap = {}; EVENTS.forEach(function (e) { evRevMap[e.id] = 0 })
  ALL_PALCOS.forEach(function (p) { if (p.modes.seatEvent && p.modes.seatEvent.taken) { Object.keys(p.modes.seatEvent.taken).forEach(function (occId) { var n = (p.modes.seatEvent.taken[occId] || []).length; var eid = occToEvent[occId] || occId; if (evRevMap[eid] == null) evRevMap[eid] = 0; evRevMap[eid] += n * p.modes.seatEvent.price }) } })
  var topEvents = EVENTS.map(function (e) { return { e: e, rev: evRevMap[e.id] || 0 } }).sort(function (a, b) { return b.rev - a.rev }).slice(0, 5)
  var topMax = topEvents.reduce(function (m, x) { return Math.max(m, x.rev) }, 1)
  var adminTopEvents = topEvents.map(function (x) { return { opp: x.e.opp, comp: x.e.comp, date: x.e.day + ' ' + x.e.month, val: self.money(x.rev), barStyle: 'height:8px; border-radius:5px; background:var(--success,#34D17E); width:' + Math.max(3, Math.round(x.rev / topMax * 100)) + '%;' } })

  var adminEvents = EVENTS.slice().map(function (ev) { var st = stad(ev.stadium); var tn = (EVENT_TYPES.find(function (t) { return t.id === ev.type }) || {}).name || ev.comp; var occs = eventOccurrences(ev); var first = occs[0] || ev; var multi = occs.length > 1; return { id: ev.id, date: first.day + ' ' + first.month, dow: first.dow, time: multi ? (occs.length + ' funciones') : first.time, datesCount: occs.length, multiDate: multi, opp: ev.opp, comp: ev.comp, round: ev.round || '—', stadiumName: st.name, stadiumShort: st.short, country: ev.country || st.country || '—', tag: ev.tag, tagStyle: evTagStyle(ev.tag), typeName: tn, obs: ev.obs || '', edit: function () { self.openEvModalEdit(ev.id) } } }).reverse()

  var adminStadiums = STAD_LIST.map(function (st) { return { id: st.id, name: st.name, short: st.short, city: st.city || '—', country: st.country || '—', address: st.address || '—', capacity: st.capacity ? st.capacity.toLocaleString('es-UY') : '—', year: st.year || '—', surface: st.surface || '—', levels: String(st.levels || '—'), roof: (st.roof ? 'Techado' : 'Abierto'), palcos: String(ALL_PALCOS.filter(function (p) { return p.stadium === st.id }).length), events: String(EVENTS.filter(function (e) { return e.stadium === st.id }).length), edit: function () { self.openStadModalEdit(st.id) } } })

  var adminPalcos = ALL_PALCOS.map(function (p) { var stt = stad(p.stadium); var status = self.statusOf(p); var b = statusBadge(status); var fp = self.fromPrice(p); var occ = (p.modes.seatYear.on && p.modes.seatYear.taken) ? Math.round(p.modes.seatYear.taken.length / p.seats * 100) : 0
    return { id: p.id, title: p.title, host: p.host, stadiumName: stt.name, stadiumShort: stt.short, seats: String(p.seats), parking: (p.parking.has ? ('Estac. x' + p.parking.n) : 'Sin estac.'), price: self.money(fp.v), priceLabel: fp.l, statusLabel: b.lbl, statusStyle: b.style, occ: occ + '%',
      occBar: 'height:100%; width:' + occ + '%; background:var(--success,#34D17E); border-radius:4px;' } })

  var finByStad = STAD_LIST.map(function (st) { var rev = revByStad[st.id] || 0; var comm = Math.round(rev * 0.04); return { name: st.name, rev: self.money(rev), comm: self.money(comm), payout: self.money(rev - comm) } })
  var finKpis = [{ label: 'INGRESOS BRUTOS', value: self.money(gmv), accent: true }, { label: 'COMISIÓN (4%)', value: self.money(commission) }, { label: 'PAYOUT PALQUISTAS', value: self.money(payout) }, { label: 'INGRESO BOTANA', value: self.money(foodRev) }]
  var finCommMax = Math.max.apply(null, monthSales.concat([1]))
  var finMonthBars = monthSales.map(function (v, i) { var c = Math.round(v * 0.04); return { mo: monthsLbl[i], val: self.money(c), barStyle: 'width:100%; height:' + Math.max(8, Math.round(v / finCommMax * 100)) + '%; border-radius:5px 5px 2px 2px; background:linear-gradient(180deg, var(--success,#34D17E), color-mix(in srgb,var(--success,#34D17E) 45%, transparent));' } })

  var adminClients = s.accounts.map(function (a) {
    var aOrders = ordersAll.filter(function (o) { return o.userId === a.id })
    var spent = aOrders.reduce(function (x, o) { return x + (o.total || 0) + (o.foodTotal || 0) }, 0)
    var initials = (a.name || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0) }).join('').toUpperCase()
    return { id: a.id, name: a.name, email: a.email, phone: a.phone || '—', initials: initials, isAdminUser: !!a.admin,
      ordersN: String(aOrders.length), spent: self.money(spent), points: (a.points || 0).toLocaleString('es-UY'),
      expanded: s.adminClient === a.id,
      orderList: aOrders.slice().reverse().map(function (o) { return { code: o.code, date: (function () { try { return new Date(o.date).toLocaleDateString('es-UY', { day: '2-digit', month: 'short', year: 'numeric' }) } catch (e) { return '' } })(), total: self.money((o.total || 0) + (o.foodTotal || 0)), items: String(o.items.length) + ' ítem' + (o.items.length === 1 ? '' : 's') } }),
      toggle: function () { self.openClient(a.id) } }
  })

  var adminReservas = ordersAll.slice().reverse().map(function (o) { var acct = s.accounts.find(function (a) { return a.id === o.userId }); var it0 = o.items[0] || {}; return { code: o.code, client: acct ? acct.name : ((o.contact && o.contact.name) || '—'), date: (function () { try { return new Date(o.date).toLocaleDateString('es-UY', { day: '2-digit', month: 'short', year: 'numeric' }) } catch (e) { return '' } })(), total: self.money((o.total || 0) + (o.foodTotal || 0)), palco: it0.palcoTitle || '—', mode: it0.modeLabel || '' } })

  // Palcos pendientes de verificación (recién registrados o reenviados).
  var pendingPalcos = ALL_PALCOS.filter(function (p) { return self.statusOf(p) === 'pendiente' })
  var pendingCount = pendingPalcos.length
  var adminPending = pendingPalcos.map(function (p) {
    var stt = stad(p.stadium)
    var docs = p.payout ? ['idFront', 'idBack', 'proofOfAddress', 'propertyTitle'].filter(function (k) { return p.payout[k] }).length : 0
    return {
      id: p.id, title: p.title, host: p.host, stadiumName: stt.name, country: p.country || stt.country || '—',
      seats: String(p.seats), parking: (p.parking.has ? ('Estac. x' + p.parking.n) : 'Sin estac.'),
      amenities: String((p.amenities || []).length), coOwners: String((p.coOwners || []).length),
      photos: String((p.images || []).length), docs: docs + '/4',
      resubmitted: !!p.review,
      review: function () { self.openPalcoReview(p.id) },
    }
  })

  var adminTabs = [['dashboard', 'Dashboard'], ['eventos', 'Eventos'], ['estadios', 'Estadios'], ['palcos', 'Palcos'], ['verificacion', 'Verificación'], ['clientes', 'Clientes'], ['reservas', 'Reservas'], ['finanzas', 'Finanzas']].map(function (o) { var on = s.adminTab === o[0]; return { id: o[0], label: o[1], active: on, badge: (o[0] === 'verificacion' && pendingCount > 0) ? String(pendingCount) : '', pick: function () { self.setAdminTab(o[0]) },
    style: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left', padding: '11px 13px', borderRadius: '10px', cursor: 'pointer', border: 'none', fontFamily: 'Archivo', fontWeight: '700', fontSize: '14px', background: (on ? 'var(--primary,#C9A24B)' : 'transparent'), color: (on ? 'var(--primary-foreground,#1A1407)' : 'var(--muted-foreground,#9AA6B2)') } } })

  return {
    // layout
    adminLayout: mobile ? 'display:flex; flex-direction:column; gap:16px;' : 'display:grid; grid-template-columns:220px minmax(0,1fr); gap:24px; align-items:start;',
    adminSidebar: mobile ? 'display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; padding-bottom:4px;' : 'position:sticky; top:88px; display:flex; flex-direction:column; gap:4px; padding:10px; background:var(--card,#171B22); border:1px solid var(--border,rgba(255,255,255,.09)); border-radius:16px;',
    adminKpiGrid: 'display:grid; grid-template-columns:repeat(auto-fit,minmax(' + (mobile ? '150px' : '190px') + ',1fr)); gap:12px;',
    // tabs
    adminTabs: adminTabs,
    adminTabDashboard: s.adminTab === 'dashboard',
    adminTabEventos: s.adminTab === 'eventos',
    adminTabEstadios: s.adminTab === 'estadios',
    adminTabClientes: s.adminTab === 'clientes',
    adminTabReservas: s.adminTab === 'reservas',
    adminTabPalcos: s.adminTab === 'palcos',
    adminTabVerificacion: s.adminTab === 'verificacion',
    adminTabFinanzas: s.adminTab === 'finanzas',
    // dashboard
    adminKpis: adminKpis,
    adminRevStad: adminRevStad,
    adminRecent: adminRecent,
    hasRecent: adminRecent.length > 0,
    adminMonthBars: adminMonthBars,
    adminDonut: adminDonut,
    adminModality: adminModality,
    adminTopEvents: adminTopEvents,
    // eventos
    adminEvents: adminEvents,
    openEvModal: function () { self.openEvModal() },
    openEvModalEdit: function (id) { self.openEvModalEdit(id) },
    // estadios
    adminStadiums: adminStadiums,
    openStadModal: function () { self.openStadModal() },
    // palcos
    adminPalcos: adminPalcos,
    // verificación
    adminPending: adminPending,
    pendingCount: pendingCount,
    // clientes
    adminClients: adminClients,
    // reservas
    adminReservas: adminReservas,
    hasReservas: adminReservas.length > 0,
    // finanzas
    finKpis: finKpis,
    finByStad: finByStad,
    finMonthBars: finMonthBars,
  }
}
