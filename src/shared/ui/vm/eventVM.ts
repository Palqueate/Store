// @ts-nocheck
// Event availability + event-card VM, lifted verbatim from computeVals. Shared
// by Home, Events and EventPalcos. Takes the facade `self`.
import { evTagStyle } from './helpers'
import { eventOccurrences } from '@/modules/events/domain/Event'

// Disponibilidad de un evento. Si `occId` viene, se calcula para esa función
// (fecha + hora) concreta. Si no, se resume el evento completo tomando, por
// palco, la mejor disponibilidad entre todas sus funciones (para las tarjetas).
export function evAvail(self, ev, occId) {
  var occIds = occId ? [occId] : eventOccurrences(ev).map(function (o) { return o.id })
  function freeFor(p) { return occIds.reduce(function (m, oid) { return Math.max(m, self.eventFreeSeats(p, oid)) }, 0) }
  var palcos = self.allPalcos().filter(function (p) { var st = self.statusOf(p); return p.stadium === ev.stadium && (st === 'publicado' || st === 'alquilado') && p.modes.seatEvent.on })
  var withSeats = palcos.filter(function (p) { return freeFor(p) > 0 })
  var freeTotal = withSeats.reduce(function (a, p) { return a + freeFor(p) }, 0)
  var minPrice = withSeats.reduce(function (m, p) { return Math.min(m, p.modes.seatEvent.price) }, Infinity)
  var maxFree = withSeats.reduce(function (m, p) { return Math.max(m, freeFor(p)) }, 0)
  return { palcos: palcos, boxes: withSeats.length, freeTotal: freeTotal, maxFree: maxFree, minPrice: (minPrice === Infinity ? 0 : minPrice) }
}

export function evCardVM(self, ev) {
  var STADIUMS = self.state.stadiums
  var a = evAvail(self, ev); var so = a.boxes === 0
  var occs = eventOccurrences(ev); var multiDate = occs.length > 1
  var first = occs[0] || ev
  return { id: ev.id, stadium: ev.stadium, day: first.day, month: first.month, dow: first.dow, time: first.time, comp: ev.comp, round: ev.round, opp: ev.opp, tag: ev.tag, images: ev.images || [], image: (ev.images || [])[0] || '',
    stadiumShort: STADIUMS[ev.stadium].short, stadiumName: STADIUMS[ev.stadium].name, tagStyle: evTagStyle(ev.tag),
    multiDate: multiDate, datesCount: occs.length, timeText: multiDate ? 'Varias funciones' : (first.time + ' hs'),
    boxes: a.boxes, soldOut: so, maxFree: a.maxFree, freeTotal: a.freeTotal, minPriceNum: a.minPrice,
    availTxt: so ? 'Sin disponibilidad' : (a.boxes + ' palco' + (a.boxes > 1 ? 's' : '') + ' · ' + a.freeTotal + ' asientos'),
    dotStyle: 'width:8px; height:8px; border-radius:50%; flex:0 0 auto; background:' + (so ? 'var(--subtle-foreground)' : 'var(--success)') + ';',
    priceTxt: a.minPrice > 0 ? self.money(a.minPrice) : '—', priceLabel: a.minPrice > 0 ? 'DESDE · ASIENTO' : 'SIN CUPO',
    ctaLabel: so ? 'Agotado' : (multiDate ? 'Elegir fecha' : 'Ver palcos'),
    ctaStyle: 'flex:0 0 auto; display:inline-flex; align-items:center; height:34px; padding:0 14px; border-radius:9px; font-family:Archivo; font-weight:800; font-size:13px; ' + (so ? 'background:var(--muted); color:var(--subtle-foreground);' : 'background:var(--primary); color:var(--primary-foreground);'),
    open: function () { self.openEventPalcos(ev.id) } }
}
