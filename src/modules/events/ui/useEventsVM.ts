// @ts-nocheck
import { useFacade } from '@/shared/ui/vm/facade'
import { evCardVM } from '@/shared/ui/vm/eventVM'
import { chipS } from '@/shared/ui/vm/helpers'

export function useEventsVM(): any {
  const self = useFacade()
  const s = self.state
  var mobile = s.vw < 860
  var EVENTS = s.events

  var evStadiums = s.evStadiums || []
  var q = (s.evQuery || '').trim().toLowerCase()

  var eventCards = EVENTS.map(function (ev) { return evCardVM(self, ev) })
  var eventCardsF = eventCards.filter(function (c) {
    if (evStadiums.length && evStadiums.indexOf(c.stadium) < 0) return false
    if (s.evType !== 'all' && c.type !== s.evType) return false
    if (s.evClub !== 'all' && c.opp !== s.evClub) return false
    if (s.evSeats > 0 && c.maxFree < s.evSeats) return false
    if (q) {
      var hay = [c.comp, c.round, c.opp, c.label, c.stadiumName].filter(Boolean).join(' ').toLowerCase()
      if (hay.indexOf(q) < 0) return false
    }
    return true
  })

  // Estadios multiselect, derivados de los estadios con eventos.
  var stadiumIds = []; EVENTS.forEach(function (e) { if (stadiumIds.indexOf(e.stadium) < 0) stadiumIds.push(e.stadium) })
  var evStadiumOptions = stadiumIds.map(function (id) { var st = s.stadiums[id]; return { value: id, label: st ? (st.short + ' · ' + st.name) : id } })

  // Tipo de evento (Fútbol / Basket / Show…) según los tipos presentes.
  var typesPresent = []; eventCards.forEach(function (c) { if (typesPresent.indexOf(c.type) < 0) typesPresent.push(c.type) })
  var TYPE_LABELS = {}; (s.eventTypes || []).forEach(function (t) { TYPE_LABELS[t.id] = t.name })
  var evTypeChips = [{ v: 'all', l: 'Todos' }].concat(typesPresent.map(function (t) { return { v: t, l: TYPE_LABELS[t] || (t.charAt(0).toUpperCase() + t.slice(1)) } })).map(function (o) {
    return { label: o.l, active: s.evType === o.v, style: chipS(s.evType === o.v), pick: function () { self.setState({ evType: o.v }) } }
  })

  var CLUBS = []; EVENTS.forEach(function (e) { if (CLUBS.indexOf(e.opp) < 0) CLUBS.push(e.opp) }); CLUBS.sort()
  var evClubOptions = [{ value: 'all', label: 'Todos los rivales' }].concat(CLUBS.map(function (c) { return { value: c, label: c } }))

  var evSeatsChips = [[0, 'Cualquiera'], [2, '2+'], [4, '4+'], [6, '6+']].map(function (o) {
    return { label: o[1], active: s.evSeats === o[0], style: chipS(s.evSeats === o[0]), pick: function () { self.setState({ evSeats: o[0] }) } }
  })

  var evFiltersActive = (q ? 1 : 0) + (evStadiums.length ? 1 : 0) + (s.evType !== 'all' ? 1 : 0) + (s.evClub !== 'all' ? 1 : 0) + (s.evSeats > 0 ? 1 : 0)

  return {
    eventsCount: eventCardsF.length,
    eventsWrap: mobile ? 'display:flex; flex-direction:column; gap:18px;' : 'display:flex; gap:30px; align-items:flex-start;',
    eventsSidebar: mobile ? 'width:100%;' : 'width:262px; flex:0 0 262px; position:sticky; top:88px;',
    eventsCol: 'flex:1; min-width:0;',
    eventsGrid: 'display:grid; grid-template-columns:repeat(auto-fill,minmax(' + (mobile ? '260px' : '300px') + ',1fr)); gap:16px; align-content:start;',
    hasEvents: eventCardsF.length > 0,
    noEvents: eventCardsF.length === 0,
    eventCardsF: eventCardsF,
    query: s.evQuery,
    setQuery: function (v) { self.setState({ evQuery: v }) },
    evStadiumOptions: evStadiumOptions,
    evStadiumValue: evStadiums,
    setEvStadiums: function (vals) { self.setState({ evStadiums: vals }) },
    evTypeChips: evTypeChips,
    evClubOptions: evClubOptions,
    evClubVal: s.evClub,
    setEvClub: function (e) { self.setState({ evClub: e.target.value }) },
    evSeatsChips: evSeatsChips,
    evFiltersActive: evFiltersActive || null,
    clearEvFilters: function () { self.setState({ evQuery: '', evStadiums: [], evType: 'all', evClub: 'all', evSeats: 0 }) },
  }
}
