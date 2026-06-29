// @ts-nocheck
import { useFacade } from '@/shared/ui/vm/facade'
import { evAvail } from '@/shared/ui/vm/eventVM'
import { evTagStyle } from '@/shared/ui/vm/helpers'

export function useEventPalcosVM(): any {
  const self = useFacade()
  const s = self.state
  var mobile = s.vw < 860
  var EVENTS = s.events
  var STADIUMS = s.stadiums


  var epEvent = EVENTS.find(function (e) { return e.id === s.eventId }) || EVENTS[0]
  var epA = epEvent ? evAvail(self, epEvent) : { palcos: [], boxes: 0, freeTotal: 0, maxFree: 0, minPrice: 0 }

  var epList = epA.palcos.map(function (p) {
    var free = self.eventFreeSeats(p, epEvent.id); var so = free <= 0
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
      open: so ? function () { self.flash('Sin asientos para este evento') } : function () { self.openDetailEvent(p.id, epEvent.id) },
    }
  })
  epList.sort(function (a, b) { return (a.soldOut ? 1 : 0) - (b.soldOut ? 1 : 0) || b.free - a.free })

  var epMarkers = epA.palcos.map(function (p) {
    var free = self.eventFreeSeats(p, epEvent.id)
    return {
      x: p.map.x, y: p.map.y, kind: free > 0 ? 'open' : 'full', badge: free > 0 ? free : null,
      click: free > 0 ? function () { self.openDetailEvent(p.id, epEvent.id) } : null,
    }
  })

  var ep = epEvent ? {
    day: epEvent.day, month: epEvent.month, dow: epEvent.dow, time: epEvent.time,
    comp: epEvent.comp, round: epEvent.round, opp: epEvent.opp, images: epEvent.images || [],
    stadium: epEvent.stadium, stadiumName: STADIUMS[epEvent.stadium].name,
    tagStyle: evTagStyle(epEvent.tag), tag: epEvent.tag,
    boxes: epA.boxes, freeTotal: epA.freeTotal,
    hasAvail: epList.length > 0, noAvail: epList.length === 0,
  } : null

  return {
    goEvents: function () { self.goEvents() },
    ep: ep,
    epWrap: mobile ? 'display:flex; flex-direction:column; gap:22px;' : 'display:grid; grid-template-columns:minmax(0,1fr) 380px; gap:34px; align-items:start;',
    epListGrid: 'display:flex; flex-direction:column; gap:12px;',
    epList: epList,
    epMarkers: epMarkers,
    epMapCol: mobile ? '' : 'position:sticky; top:88px;',
  }
}
