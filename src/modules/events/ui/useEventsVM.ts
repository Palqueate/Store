// @ts-nocheck
import { useFacade } from '@/shared/ui/vm/facade'
import { evCardVM } from '@/shared/ui/vm/eventVM'

var MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SET', 'SEP', 'OCT', 'NOV', 'DIC']
function sortKey(c) {
  var mi = MONTHS.indexOf((c.month || '').toUpperCase()); if (mi < 0) mi = 99
  // SET y SEP comparten septiembre; normalizamos para que ordenen igual.
  if (mi === 9) mi = 8
  return mi * 100 + (parseInt(c.day, 10) || 0)
}

export function useEventsVM(): any {
  const self = useFacade()
  const s = self.state
  var mobile = s.vw < 860
  var EVENTS = s.events
  var STADIUMS = s.stadiums

  var q = (s.evQuery || '').trim().toLowerCase()

  var eventCards = EVENTS.map(function (ev) { return evCardVM(self, ev) })

  var eventCardsF = eventCards.filter(function (c) {
    if (s.evStadium !== 'all' && c.stadium !== s.evStadium) return false
    if (s.evComp !== 'all' && c.comp !== s.evComp) return false
    if (s.evSeats > 0 && c.maxFree < s.evSeats) return false
    if (s.evOnlyAvail && c.soldOut) return false
    if (q) {
      var hay = [c.opp, c.comp, c.round, c.tag, c.stadiumName, c.stadiumShort].join(' ').toLowerCase()
      if (hay.indexOf(q) < 0) return false
    }
    return true
  })

  // Orden
  eventCardsF.sort(function (a, b) {
    if (s.evSort === 'avail') return (b.freeTotal || 0) - (a.freeTotal || 0)
    if (s.evSort === 'price') {
      var pa = a.minPriceNum > 0 ? a.minPriceNum : Infinity
      var pb = b.minPriceNum > 0 ? b.minPriceNum : Infinity
      return pa - pb
    }
    return sortKey(a) - sortKey(b) // 'next' = próximas fechas
  })

  // Opciones de estadio (derivadas de los estadios reales).
  var evStadiumOptions = [{ value: 'all', label: 'Todos los estadios' }].concat(
    Object.keys(STADIUMS).map(function (k) { return { value: k, label: STADIUMS[k].name } })
  )

  // Opciones de tipo / competición (derivadas de los eventos cargados).
  var COMPS = []; EVENTS.forEach(function (e) { if (e.comp && COMPS.indexOf(e.comp) < 0) COMPS.push(e.comp) }); COMPS.sort()
  var evCompOptions = [{ value: 'all', label: 'Todos los tipos' }].concat(COMPS.map(function (c) { return { value: c, label: c } }))

  var evSeatsOptions = [{ value: '0', label: 'Cualquier cupo' }, { value: '2', label: '2+ juntos' }, { value: '4', label: '4+ juntos' }, { value: '6', label: '6+ juntos' }]

  var evSortOptions = [{ value: 'next', label: 'Próximas fechas' }, { value: 'avail', label: 'Más disponibilidad' }, { value: 'price', label: 'Menor precio' }]

  var evFiltersActive = (s.evStadium !== 'all' ? 1 : 0) + (s.evComp !== 'all' ? 1 : 0) + (s.evSeats > 0 ? 1 : 0) + (s.evOnlyAvail ? 1 : 0) + (q ? 1 : 0)

  return {
    eventsCount: eventCardsF.length,
    eventsGrid: 'display:grid; grid-template-columns:repeat(auto-fill,minmax(' + (mobile ? '260px' : '300px') + ',1fr)); gap:16px; align-content:start;',
    hasEvents: eventCardsF.length > 0,
    noEvents: eventCardsF.length === 0,
    eventCardsF: eventCardsF,

    // Buscador
    evQuery: s.evQuery,
    setEvQuery: function (v) { self.setState({ evQuery: v }) },

    // Selects compactos
    evStadiumOptions: evStadiumOptions,
    evStadiumVal: s.evStadium,
    setEvStadium: function (v) { self.setState({ evStadium: v }) },

    evCompOptions: evCompOptions,
    evCompVal: s.evComp,
    setEvComp: function (v) { self.setState({ evComp: v }) },

    evSeatsOptions: evSeatsOptions,
    evSeatsVal: String(s.evSeats || 0),
    setEvSeats: function (v) { self.setState({ evSeats: parseInt(v, 10) || 0 }) },

    evSortOptions: evSortOptions,
    evSortVal: s.evSort || 'next',
    setEvSort: function (v) { self.setState({ evSort: v }) },

    evOnlyAvail: !!s.evOnlyAvail,
    toggleOnlyAvail: function () { self.setState({ evOnlyAvail: !s.evOnlyAvail }) },

    evFiltersActive: evFiltersActive || null,
    clearEvFilters: function () { self.setState({ evStadium: 'all', evComp: 'all', evSeats: 0, evQuery: '', evOnlyAvail: false }) },
  }
}
