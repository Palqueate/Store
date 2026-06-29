// @ts-nocheck
import { useFacade } from '@/shared/ui/vm/facade'
import { evCardVM } from '@/shared/ui/vm/eventVM'
import { chipS } from '@/shared/ui/vm/helpers'

export function useEventsVM(): any {
  const self = useFacade()
  const s = self.state
  var mobile = s.vw < 860
  var EVENTS = s.events

  var eventCards = EVENTS.map(function (ev) { return evCardVM(self, ev) })
  var eventCardsF = eventCards.filter(function (c) {
    if (s.evStadium !== 'all' && c.stadium !== s.evStadium) return false
    if (s.evComp !== 'all' && c.comp !== s.evComp) return false
    if (s.evClub !== 'all' && c.opp !== s.evClub) return false
    if (s.evSeats > 0 && c.maxFree < s.evSeats) return false
    return true
  })

  var evStadiumChips = [['all', 'Todos'], ['gpc', 'GPC'], ['cds', 'CDS']].map(function (o) {
    return { label: o[1], active: s.evStadium === o[0], style: chipS(s.evStadium === o[0]), pick: function () { self.setState({ evStadium: o[0] }) } }
  })

  var COMPS = []; EVENTS.forEach(function (e) { if (COMPS.indexOf(e.comp) < 0) COMPS.push(e.comp) })
  var evCompChips = [{ v: 'all', l: 'Todas' }].concat(COMPS.map(function (c) { return { v: c, l: c } })).map(function (o) {
    return { label: o.l, active: s.evComp === o.v, style: chipS(s.evComp === o.v), pick: function () { self.setState({ evComp: o.v }) } }
  })

  var CLUBS = []; EVENTS.forEach(function (e) { if (CLUBS.indexOf(e.opp) < 0) CLUBS.push(e.opp) }); CLUBS.sort()
  var evClubOptions = [{ value: 'all', label: 'Todos los rivales' }].concat(CLUBS.map(function (c) { return { value: c, label: c } }))

  var evSeatsChips = [[0, 'Cualquiera'], [2, '2+'], [4, '4+'], [6, '6+']].map(function (o) {
    return { label: o[1], active: s.evSeats === o[0], style: chipS(s.evSeats === o[0]), pick: function () { self.setState({ evSeats: o[0] }) } }
  })

  var evFiltersActive = (s.evStadium !== 'all' ? 1 : 0) + (s.evComp !== 'all' ? 1 : 0) + (s.evClub !== 'all' ? 1 : 0) + (s.evSeats > 0 ? 1 : 0)

  return {
    eventsCount: eventCardsF.length,
    eventsWrap: mobile ? 'display:flex; flex-direction:column; gap:18px;' : 'display:flex; gap:30px; align-items:flex-start;',
    eventsSidebar: mobile ? 'width:100%;' : 'width:262px; flex:0 0 262px; position:sticky; top:88px;',
    eventsCol: 'flex:1; min-width:0;',
    eventsGrid: 'display:grid; grid-template-columns:repeat(auto-fill,minmax(' + (mobile ? '260px' : '300px') + ',1fr)); gap:16px; align-content:start;',
    hasEvents: eventCardsF.length > 0,
    noEvents: eventCardsF.length === 0,
    eventCardsF: eventCardsF,
    evStadiumChips: evStadiumChips,
    evCompChips: evCompChips,
    evClubOptions: evClubOptions,
    evClubVal: s.evClub,
    setEvClub: function (e) { self.setState({ evClub: e.target.value }) },
    evSeatsChips: evSeatsChips,
    evFiltersActive: evFiltersActive || null,
    clearEvFilters: function () { self.setState({ evStadium: 'all', evComp: 'all', evClub: 'all', evSeats: 0 }) },
  }
}
