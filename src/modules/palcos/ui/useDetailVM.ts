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
    det.amenities = dp.amenities || []
    det.modeCards = dvm.modeDefs.filter(function (m) { return m.on }).map(function (m) {
      var on = s.mode === m.key
      return {
        key: m.key, title: m.title, sub: m.sub, term: m.term, price: self.money(m.price), check: on, pick: function () { self.setMode(m.key) },
        style: { position: 'relative', textAlign: 'left', cursor: 'pointer', padding: '14px 15px', borderRadius: '13px', width: '100%', display: 'flex', flexDirection: 'column', gap: '3px', border: '1.5px solid ' + (on ? 'var(--primary)' : 'var(--border)'), background: (on ? 'color-mix(in srgb,var(--primary) 13%, var(--card))' : 'var(--card)') },
        dotStyle: { position: 'absolute', top: '14px', right: '14px', width: '18px', height: '18px', borderRadius: '50%', border: '2px solid ' + (on ? 'var(--primary)' : 'var(--subtle-foreground)'), background: (on ? 'var(--primary)' : 'transparent'), display: 'grid', placeItems: 'center' }
      }
    })
    det.showSeats = s.mode !== 'palcoYear'
    det.showEvents = s.mode === 'seatEvent'
    det.allMode = s.mode === 'palcoYear'
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
    det.canReserve = s.mode === 'palcoYear' ? true : dvm.qty > 0
    det.summary = s.mode === 'palcoYear' ? 'Palco entero · 1 año' : (s.mode === 'seatYear' ? (dvm.qty + ' asiento' + (dvm.qty === 1 ? '' : 's') + ' · anual') : (dvm.qty + ' asiento' + (dvm.qty === 1 ? '' : 's') + ' · evento'))
    det.unitNote = s.mode === 'palcoYear' ? 'Precio total del año' : (dvm.qty > 0 ? (dvm.qty + ' × ' + self.money(s.mode === 'seatYear' ? dp.modes.seatYear.price : dp.modes.seatEvent.price)) : 'Elegí tus asientos')
    var curEv = EVENTS.find(function (e) { return e.id === s.eventId })
    var curOcc = curEv ? eventOccurrence(curEv, s.occurrenceId ?? undefined) : null
    det.fromEvent = !!s.fromEvent && !!curEv
    det.eventName = curEv ? (curEv.comp + (curEv.round ? (' · ' + curEv.round) : '')) : ''
    det.eventOpp = curEv ? curEv.opp : ''
    det.eventWhen = curOcc ? (curOcc.dow + ' ' + curOcc.day + ' ' + curOcc.month + ' · ' + curOcc.time + ' hs') : ''
    det.backLabel = s.fromEvent ? 'Volver al evento' : 'Volver a palcos'
    // Volver al evento conservando la función (fecha + hora) ya elegida.
    det.back = s.fromEvent ? function () { self.go('eventPalcos') } : function () { self.go('results') }
    det.showEvents = s.mode === 'seatEvent' && !s.fromEvent
  }

  return {
    det: det,
    detailWrap: mobile ? 'display:flex; flex-direction:column; gap:22px;' : 'display:grid; grid-template-columns:minmax(0,1fr) 372px; gap:36px; align-items:start;',
    detailBooking: mobile ? '' : 'position:sticky; top:88px;',
    reserveDisabled: !det.canReserve,
    addToCart: function () { self.addToCart() },
  }
}
