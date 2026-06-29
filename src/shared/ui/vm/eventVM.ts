// @ts-nocheck
// Event availability + event-card VM, lifted verbatim from computeVals. Shared
// by Home, Events and EventPalcos. Takes the facade `self`.
import { evTagStyle } from './helpers'

export function evAvail(self, ev) {
  var palcos = self.allPalcos().filter(function (p) { return p.stadium === ev.stadium && self.statusOf(p) !== 'pausado' && p.modes.seatEvent.on })
  var withSeats = palcos.filter(function (p) { return self.eventFreeSeats(p, ev.id) > 0 })
  var freeTotal = withSeats.reduce(function (a, p) { return a + self.eventFreeSeats(p, ev.id) }, 0)
  var minPrice = withSeats.reduce(function (m, p) { return Math.min(m, p.modes.seatEvent.price) }, Infinity)
  var maxFree = withSeats.reduce(function (m, p) { return Math.max(m, self.eventFreeSeats(p, ev.id)) }, 0)
  return { palcos: palcos, boxes: withSeats.length, freeTotal: freeTotal, maxFree: maxFree, minPrice: (minPrice === Infinity ? 0 : minPrice) }
}

export function evCardVM(self, ev) {
  var STADIUMS = self.state.stadiums
  var a = evAvail(self, ev); var so = a.boxes === 0
  return { id: ev.id, stadium: ev.stadium, day: ev.day, month: ev.month, dow: ev.dow, time: ev.time, comp: ev.comp, round: ev.round, opp: ev.opp, tag: ev.tag, images: ev.images || [], image: (ev.images || [])[0] || '',
    stadiumShort: STADIUMS[ev.stadium].short, stadiumName: STADIUMS[ev.stadium].name, tagStyle: evTagStyle(ev.tag),
    boxes: a.boxes, soldOut: so, maxFree: a.maxFree,
    availTxt: so ? 'Sin disponibilidad' : (a.boxes + ' palco' + (a.boxes > 1 ? 's' : '') + ' · ' + a.freeTotal + ' asientos'),
    dotStyle: 'width:8px; height:8px; border-radius:50%; flex:0 0 auto; background:' + (so ? 'var(--subtle-foreground)' : 'var(--success)') + ';',
    priceTxt: a.minPrice > 0 ? self.money(a.minPrice) : '—', priceLabel: a.minPrice > 0 ? 'DESDE · ASIENTO' : 'SIN CUPO',
    ctaLabel: so ? 'Agotado' : 'Ver palcos',
    ctaStyle: 'flex:0 0 auto; display:inline-flex; align-items:center; height:34px; padding:0 14px; border-radius:9px; font-family:Archivo; font-weight:800; font-size:13px; ' + (so ? 'background:var(--muted); color:var(--subtle-foreground);' : 'background:var(--primary); color:var(--primary-foreground);'),
    open: function () { self.openEventPalcos(ev.id) } }
}
