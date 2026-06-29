// @ts-nocheck
import { useFacade } from '@/shared/ui/vm/facade'
import { evAvail } from '@/shared/ui/vm/eventVM'
import { evTagStyle } from '@/shared/ui/vm/helpers'
import { eventOccurrences } from '@/modules/events/domain/Event'

export function useEventPalcosVM(): any {
  const self = useFacade()
  const s = self.state
  var mobile = s.vw < 860
  var EVENTS = s.events
  var STADIUMS = s.stadiums


  var epEvent = EVENTS.find(function (e) { return e.id === s.eventId }) || EVENTS[0]
  var occs = epEvent ? eventOccurrences(epEvent) : []
  // Función elegida: la del estado si pertenece a este evento; si el evento
  // tiene una sola, se autoselecciona; si no, queda sin elegir (el cliente
  // primero elige fecha y hora).
  // Si la función del estado no pertenece a este evento (p. ej. al llegar por
  // URL directa), se autoselecciona la primera.
  var selOcc = occs.find(function (o) { return o.id === s.occurrenceId }) || occs[0] || null
  var selOccId = selOcc ? selOcc.id : null
  var multiDate = occs.length > 1

  // Chips de funciones (fecha + hora) con su disponibilidad.
  var epDates = occs.map(function (o) {
    var a = evAvail(self, epEvent, o.id); var so = a.boxes === 0; var on = selOccId === o.id
    return {
      id: o.id, dow: o.dow, day: o.day, month: o.month, time: o.time,
      selected: on, soldOut: so,
      availTxt: so ? 'Sin disponibilidad' : (a.boxes + ' palco' + (a.boxes > 1 ? 's' : '') + ' · ' + a.freeTotal + ' asientos'),
      pick: function () { self.setOccurrence(o.id) },
    }
  })

  var epA = (epEvent && selOccId) ? evAvail(self, epEvent, selOccId) : { palcos: [], boxes: 0, freeTotal: 0, maxFree: 0, minPrice: 0 }

  var epList = selOccId ? epA.palcos.map(function (p) {
    var free = self.eventFreeSeats(p, selOccId); var so = free <= 0
    return {
      id: p.id, title: p.title, sector: p.sector, rating: p.rating.toFixed(1), stadiumShort: STADIUMS[p.stadium].short,
      free: free, soldOut: so, freeTxt: so ? 'Agotado' : (free + ' de ' + p.seats + ' libres'),
      parking: p.parking.has ? ('Estac. x' + p.parking.n) : 'Sin estac.',
      priceTxt: self.money(p.modes.seatEvent.price),
      rowStyle: 'display:flex; gap:16px; padding:16px; border-radius:15px; background:var(--card,#171B22); border:1px solid var(--border,rgba(255,255,255,.09)); ' + (so ? 'opacity:.6;' : 'cursor:pointer;') + ' transition:border-color .15s ease, transform .15s ease;',
      barStyle: 'height:6px; border-radius:4px; background:var(--muted); overflow:hidden; margin-top:7px; max-width:160px;',
      barFill: 'height:100%; width:' + Math.round((free / p.seats) * 100) + '%; background:' + (so ? 'var(--subtle-foreground)' : 'var(--success)') + ';',
      ctaLabel: so ? 'Agotado' : 'Elegir asientos',
      ctaStyle: 'flex:0 0 auto; display:inline-flex; align-items:center; justify-content:center; height:42px; padding:0 18px; border-radius:10px; border:none; font-family:Archivo; font-weight:800; font-size:14px; ' + (so ? 'background:var(--muted); color:var(--subtle-foreground); cursor:not-allowed;' : 'background:var(--primary); color:var(--primary-foreground); cursor:pointer;'),
      open: so ? function () { self.flash('Sin asientos para esta función') } : function () { self.openDetailEvent(p.id, epEvent.id, selOccId) },
    }
  }) : []
  epList.sort(function (a, b) { return (a.soldOut ? 1 : 0) - (b.soldOut ? 1 : 0) || b.free - a.free })

  var epMarkers = selOccId ? epA.palcos.map(function (p) {
    var free = self.eventFreeSeats(p, selOccId)
    return {
      id: p.id, title: p.title,
      x: p.map.x, y: p.map.y, kind: free > 0 ? 'open' : 'full', badge: free > 0 ? free : null,
      click: free > 0 ? function () { self.openDetailEvent(p.id, epEvent.id, selOccId) } : null,
    }
  }) : []

  // Para la cabecera: la función elegida o, si no hay, la primera.
  var headOcc = selOcc || occs[0] || epEvent

  var ep = epEvent ? {
    day: headOcc.day, month: headOcc.month, dow: headOcc.dow, time: headOcc.time,
    comp: epEvent.comp, round: epEvent.round, opp: epEvent.opp, obs: epEvent.obs || '', images: epEvent.images || [],
    stadium: epEvent.stadium, stadiumName: STADIUMS[epEvent.stadium].name, stadiumMap: (STADIUMS[epEvent.stadium] || {}).mapImage || '',
    tagStyle: evTagStyle(epEvent.tag), tag: epEvent.tag,
    boxes: epA.boxes, freeTotal: epA.freeTotal,
    multiDate: multiDate, hasOccSelected: !!selOccId,
    // Pide elegir fecha cuando hay varias funciones y ninguna seleccionada.
    needsDate: multiDate && !selOccId,
    hasAvail: !!selOccId && epList.length > 0,
    noAvail: !!selOccId && epList.length === 0,
  } : null

  return {
    goEvents: function () { self.goEvents() },
    ep: ep,
    epDates: epDates,
    epWrap: mobile ? 'display:flex; flex-direction:column; gap:22px;' : 'display:grid; grid-template-columns:minmax(0,1fr) 380px; gap:34px; align-items:start;',
    epListGrid: 'display:flex; flex-direction:column; gap:12px;',
    epList: epList,
    epMarkers: epMarkers,
    epMapCol: mobile ? '' : 'position:sticky; top:88px;',
  }
}
