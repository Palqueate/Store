import { useFacade } from '@/shared/ui/vm/facade'
import { evCardVM } from '@/shared/ui/vm/eventVM'

export function useHomeVM(): any {
  const self = useFacade()
  const s = self.state

  var EVENTS = s.events
  var mobile = s.vw < 860

  var eventCards = EVENTS.map(function (ev) { return evCardVM(self, ev) })
  var homeEvents = eventCards.slice(0, 3)

  var stadiumCount = Object.keys(s.stadiums || {}).length
  var heroStats = [{ n: stadiumCount + '', l: 'ESTADIOS' }, { n: self.allPalcos().length + '', l: 'PALCOS ACTIVOS' }, { n: EVENTS.length + '', l: 'EVENTOS' }, { n: '4.8', l: 'RATING PROMEDIO' }]

  var steps = [
    { n: '01', t: 'Encontrá tu lugar', d: 'Filtrá por estadio y ubicación. Mirá exactamente dónde está el palco en el mapa.' },
    { n: '02', t: 'Reservá y pagá', d: 'Elegí tus butacas para el evento que quieras ver y asegurá tu lugar en el palco.' },
    { n: '03', t: 'Disfrutá', d: 'Tu botana y bebidas te esperan en el palco. Llegás, te sentás y a alentar.' },
  ]

  var eventsGrid = 'display:grid; grid-template-columns:repeat(auto-fill,minmax(' + (mobile ? '260px' : '300px') + ',1fr)); gap:16px; align-content:start;'

  return {
    homeEvents,
    heroStats,
    steps,
    eventsGrid,
    goEvents: function () { self.goEvents() },
    goPublish: function () { self.startWizard() },
  }
}
