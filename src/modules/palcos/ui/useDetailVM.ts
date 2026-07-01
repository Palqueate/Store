import { useFacade } from '@/shared/ui/vm/facade'
import { eventOccurrence } from '@/modules/events/domain/Event'

export function useDetailVM(): any {
  const self = useFacade(); const s = self.state;
  var STADIUMS = s.stadiums, EVENTS = s.events
  var mobile = s.vw < 860

  var dvm = self.detailVM()
  var det: any = {}
  if (dvm) {
    var dp = dvm.p
    det.title = dp.title; det.sector = dp.sector; det.stadiumName = STADIUMS[dp.stadium].name; det.rating = dp.rating.toFixed(1)
    det.host = dp.host; det.seatsN = dp.seats; det.stadium = dp.stadium; det.stadiumMap = (STADIUMS[dp.stadium] || {}).mapImage || ''; det.markers = dvm.markers; det.photos = dp.photos; det.images = dp.images || []
    det.parkLabel = dp.parking.has ? (dp.parking.n + (dp.parking.n > 1 ? ' autos' : ' auto')) : 'No incluye'
    det.parkHas = dp.parking.has
    // Estacionamiento alquilable: disponibilidad, precio por lugar y selección.
    det.parkAvail = dvm.parkAvail
    det.canAddParking = dvm.parkAvail > 0 && dvm.parkPrice > 0
    det.parkSel = dvm.parkSel
    det.parkUnitPrice = self.money(dvm.parkPrice)
    det.parkSubtotal = self.money(dvm.parkTotal)
    det.parkAvailLabel = dvm.parkAvail + (dvm.parkAvail === 1 ? ' lugar disponible' : ' lugares disponibles')
    det.amenities = dp.amenities || []
    // Precio del palco (por asiento, por evento) — única modalidad de reserva.
    det.seatPrice = self.money(dvm.price)
    det.seatList = dvm.seats.map(function (c) { return { n: c.n, state: c.st, onPick: c.click } })
    det.eventChips = dvm.events.map(function (e) {
      var on = e.selected
      return {
        id: e.occId, date: e.day + ' ' + e.month, time: e.time, label: e.opp, tag: e.tag, pick: function () { self.setEventOccurrence(e.eventId, e.occId) },
        style: { textAlign: 'left', cursor: 'pointer', padding: '11px 13px', borderRadius: '11px', width: '100%', display: 'flex', alignItems: 'center', gap: '12px', border: '1.5px solid ' + (on ? 'var(--primary)' : 'var(--border)'), background: (on ? 'color-mix(in srgb,var(--primary) 12%, var(--card))' : 'var(--card)') },
        dateStyle: { flex: '0 0 auto', width: '52px', textAlign: 'center', padding: '6px 0', borderRadius: '8px', background: (on ? 'var(--primary)' : 'var(--muted)'), color: (on ? 'var(--primary-foreground)' : 'var(--foreground)'), fontFamily: 'Archivo', fontWeight: '800', fontSize: '13px', lineHeight: '1.1' }
      }
    })
    det.total = self.money(dvm.total); det.qty = dvm.qty
    det.canReserve = dvm.qty > 0
    det.summary = dvm.qty + ' asiento' + (dvm.qty === 1 ? '' : 's') + ' · evento'
    det.unitNote = dvm.qty > 0 ? (dvm.qty + ' × ' + self.money(dp.modes.seatEvent.price)) : 'Elegí tus asientos'
    var curEv = EVENTS.find(function (e) { return e.id === s.eventId })
    var curOcc = curEv ? eventOccurrence(curEv, s.occurrenceId ?? undefined) : null
    det.fromEvent = !!s.fromEvent && !!curEv
    det.eventName = curEv ? (curEv.comp + (curEv.round ? (' · ' + curEv.round) : '')) : ''
    det.eventOpp = curEv ? curEv.opp : ''
    det.eventWhen = curOcc ? (curOcc.dow + ' ' + curOcc.day + ' ' + curOcc.month + ' · ' + curOcc.time + ' hs') : ''
    det.backLabel = s.fromEvent ? 'Volver al evento' : 'Volver a eventos'
    // Volver al evento conservando la función (fecha + hora) ya elegida.
    det.back = s.fromEvent ? function () { self.go('eventPalcos') } : function () { self.go('events') }
    // Siempre se reserva por evento: se muestra el selector de asientos, y el de
    // funciones salvo que ya se venga de un evento con la función fijada.
    det.showSeats = true
    det.showEvents = !s.fromEvent
  }

  return {
    det: det,
    detailWrap: mobile ? 'display:flex; flex-direction:column; gap:22px;' : 'display:grid; grid-template-columns:minmax(0,1fr) 372px; gap:36px; align-items:start;',
    detailBooking: mobile ? '' : 'position:sticky; top:88px;',
    reserveDisabled: !det.canReserve,
    addToCart: function () { self.addToCart() },
    incPark: function () { self.incParkSel() },
    decPark: function () { self.decParkSel() },
    setPark: function (n: number) { self.setParkSel(n) },
  }
}
