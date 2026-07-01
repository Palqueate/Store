import { useFacade } from '@/shared/ui/vm/facade'
import { statusBadge, chipS } from '@/shared/ui/vm/helpers'
import { eventOccurrences } from '@/modules/events/domain/Event'

export function useMetricsVM(): any {
  const self = useFacade()
  const s = self.state
  var STADIUMS = s.stadiums
  var EVENTS = s.events
  var mobile = s.vw < 860

  var ownedRaw = self.allPalcos().filter(function (p) { return p.host === 'Vos (demo)' })

  function idHash(id) {
    var h = 0; for (var i = 0; i < id.length; i++) { h = (h * 31 + id.charCodeAt(i)) >>> 0 } return h
  }

  function palcoMet(p) {
    var stEvents = EVENTS.filter(function (e) { return e.stadium === p.stadium })
    var occCount = 0
    var perEvent = stEvents.map(function (e) {
      // Suma de butacas vendidas en todas las funciones (fechas) del evento.
      var occs = eventOccurrences(e); occCount += occs.length
      var sold = occs.reduce(function (a, o) { var t = (p.modes.seatEvent.taken && p.modes.seatEvent.taken[o.id]) || []; return a + t.length }, 0)
      return { ev: e, sold: sold, rev: sold * (p.modes.seatEvent.on ? p.modes.seatEvent.price : 0) }
    })
    var eventTickets = perEvent.reduce(function (a, x) { return a + x.sold }, 0)
    var eventRev = perEvent.reduce(function (a, x) { return a + x.rev }, 0)
    // Ocupación por evento: butacas vendidas sobre el total de butacas-función
    // (asientos × funciones de la temporada).
    var eventCap = (p.modes.seatEvent.on ? p.seats : 0) * occCount
    var occ = eventCap > 0 ? eventTickets / eventCap : 0
    var views = 240 + (idHash(p.id) % 640) + Math.round(p.rating * 46)
    var favs = Math.round(views * 0.12)
    var bookings = eventTickets
    return {
      id: p.id, title: p.title, stadium: p.stadium, stadiumName: STADIUMS[p.stadium].name, rating: p.rating, seats: p.seats, status: self.statusOf(p),
      perEvent: perEvent, eventTickets: eventTickets, eventRev: eventRev, eventCap: eventCap,
      revenue: eventRev, occ: occ, views: views, favs: favs, bookings: bookings, conv: (views > 0 ? bookings / views : 0),
    }
  }

  var metAll = ownedRaw.map(palcoMet)
  var metSel = (s.statPid === 'all') ? metAll : metAll.filter(function (m) { return m.id === s.statPid })

  var agRevenue = 0, agEventCap = 0, agEventTickets = 0, agViews = 0, agBookings = 0
  metSel.forEach(function (m) {
    agRevenue += m.revenue; agEventCap += m.eventCap
    agEventTickets += m.eventTickets; agViews += m.views; agBookings += m.bookings
  })
  var agOcc = agEventCap > 0 ? Math.round(agEventTickets / agEventCap * 100) : 0
  var agConv = agViews > 0 ? Math.round(agBookings / agViews * 1000) / 10 : 0

  var metKpis = [
    { label: 'RECAUDACIÓN', value: self.money(agRevenue), sub: 'temporada en curso', accent: true },
    { label: 'OCUPACIÓN', value: agOcc + '%', sub: agEventTickets + ' de ' + agEventCap + ' butacas', accent: false },
    { label: 'ENTRADAS / EVENTO', value: String(agEventTickets), sub: 'butacas vendidas', accent: false },
    { label: 'VISTAS · 30 DÍAS', value: agViews.toLocaleString('es-UY'), sub: agConv + '% conversión', accent: false },
  ]

  var evMap = {}
  metSel.forEach(function (m) {
    m.perEvent.forEach(function (x) {
      if (!evMap[x.ev.id]) evMap[x.ev.id] = { ev: x.ev, sold: 0 }
      evMap[x.ev.id].sold += x.sold
    })
  })
  var evBarsArr = EVENTS.filter(function (e) { return evMap[e.id] }).map(function (e) { return evMap[e.id] })
  var evMaxSold = evBarsArr.reduce(function (m, x) { return Math.max(m, x.sold) }, 0) || 1
  var metEventBars = evBarsArr.map(function (x) {
    return {
      day: x.ev.day, mon: x.ev.month, opp: x.ev.opp, sold: x.sold,
      barStyle: 'width:100%; height:' + Math.max(6, Math.round(x.sold / evMaxSold * 100)) + '%; min-height:6px; border-radius:6px 6px 3px 3px; background:linear-gradient(180deg, var(--primary), color-mix(in srgb,var(--primary) 55%, transparent));',
    }
  })
  var hasEventBars = metEventBars.length > 0

  var months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN']
  var seedN = metSel.reduce(function (a, m) { return a + idHash(m.id) }, 0) || 7
  var trendRaw = months.map(function (mo, i) { var f = 0.55 + ((seedN >> i) % 48) / 100 + i * 0.075; return { mo: mo, val: Math.max(1, Math.round((agViews / 6) * f)) } })
  var trendMax = trendRaw.reduce(function (m, x) { return Math.max(m, x.val) }, 0) || 1
  var metTrend = trendRaw.map(function (x) {
    return { mo: x.mo, val: x.val.toLocaleString('es-UY'), barStyle: 'width:100%; height:' + Math.max(8, Math.round(x.val / trendMax * 100)) + '%; border-radius:5px 5px 2px 2px; background:color-mix(in srgb,var(--success) 78%, transparent);' }
  })

  var metRows = metAll.map(function (m) {
    var on = s.statPid === m.id; var b = statusBadge(m.status)
    return {
      id: m.id, title: m.title, stadiumName: m.stadiumName, rating: m.rating.toFixed(1),
      revenue: self.money(m.revenue), occPct: (m.eventCap > 0 ? Math.round(m.occ * 100) : 0) + '%', occTxt: (m.eventCap > 0 ? (m.eventTickets + '/' + m.eventCap) : '—'),
      occBar: 'height:100%; width:' + (m.eventCap > 0 ? Math.round(m.occ * 100) : 0) + '%; background:var(--success); border-radius:5px;',
      views: m.views.toLocaleString('es-UY'), favs: String(m.favs), tickets: String(m.eventTickets),
      statusLabel: b.lbl, statusStyle: b.style,
      rowStyle: { cursor: 'pointer', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 0.9fr 0.9fr', gap: '14px', alignItems: 'center', padding: '15px 16px', borderRadius: '13px', border: '1.5px solid ' + (on ? 'var(--primary)' : 'var(--border)'), background: (on ? 'color-mix(in srgb,var(--primary) 9%, var(--card))' : 'var(--card)') },
      pick: function () { self.setState({ statPid: on ? 'all' : m.id }) },
    }
  })

  var statPidChips = [{ id: 'all', label: 'Todos mis palcos' }]
    .concat(metAll.map(function (m) { return { id: m.id, label: m.title.replace('Palco ', '') } }))
    .map(function (o) { return { label: o.label, style: chipS(s.statPid === o.id), pick: function () { self.setState({ statPid: o.id }) } } })

  var metScope = s.statPid === 'all' ? 'Todos tus palcos' : ((metAll.find(function (m) { return m.id === s.statPid }) || {}).title || '')

  return {
    activeTab: (s.screen === 'metrics' ? 'metrics' : 'owner'),
    goOwnerTab: function () { self.go('owner') },
    goMetricsTab: function () { self.go('metrics') },
    goPublish: function () { self.startWizard() },
    metEmpty: metAll.length === 0,
    hasMet: metAll.length > 0,
    metKpis: metKpis,
    metEventBars: metEventBars,
    hasEventBars: hasEventBars,
    metTrend: metTrend,
    metRows: metRows,
    statPidChips: statPidChips,
    metScope: metScope,
    metKpiGrid: 'display:grid; grid-template-columns:repeat(auto-fit,minmax(' + (mobile ? '150px' : '200px') + ',1fr)); gap:12px; margin-bottom:18px;',
    metPanelGrid: mobile ? 'display:flex; flex-direction:column; gap:16px;' : 'display:grid; grid-template-columns:1fr 1fr; gap:16px;',
  }
}
