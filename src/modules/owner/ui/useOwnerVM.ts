// @ts-nocheck
import { useFacade } from '@/shared/ui/vm/facade'
import { statusBadge, tabS } from '@/shared/ui/vm/helpers'

export function useOwnerVM(): any {
  const self = useFacade()
  const s = self.state
  var STADIUMS = s.stadiums
  var mobile = s.vw < 860

  var owned = self.allPalcos().filter(function (p) { return p.host === 'Vos (demo)' }).map(function (p) {
    var st = self.statusOf(p); var b = statusBadge(st)
    var modes = []; if (p.modes.palcoYear.on) modes.push('Palco/año'); if (p.modes.seatYear.on) modes.push('Asiento/año'); if (p.modes.seatEvent.on) modes.push('Por evento')
    var fp = self.fromPrice(p)
    return {
      id: p.id, title: p.title, stadiumName: STADIUMS[p.stadium].name, sector: p.sector, seats: p.seats,
      parking: p.parking.has ? (p.parking.n + (p.parking.n > 1 ? ' autos' : ' auto')) : 'Sin estac.',
      statusLabel: b.lbl, statusStyle: b.style, isPaused: st === 'pausado', modes: modes,
      priceTxt: self.money(fp.v), priceLabel: fp.l, toggleLabel: st === 'pausado' ? 'Reanudar' : 'Pausar',
      toggle: function () { self.togglePublish(p.id) }, view: function () { self.openDetail(p.id) },
    }
  })

  var ownIncome = owned.reduce(function (a, o) {
    var pp = self.byId(o.id); return a + ((pp && pp.modes.palcoYear.on) ? pp.modes.palcoYear.price : 0)
  }, 0)

  var ownerStats = [
    { label: 'PALCOS', value: String(owned.length) },
    { label: 'PUBLICADOS', value: String(owned.filter(function (o) { return o.statusLabel === 'Publicado' }).length) },
    { label: 'INGRESO ANUAL EST.', value: self.money(ownIncome) },
  ]

  return {
    owned: owned,
    ownerStats: ownerStats,
    ownerEmpty: owned.length === 0,
    activeTab: (s.screen === 'metrics' ? 'metrics' : 'owner'),
    goOwnerTab: function () { self.go('owner') },
    goMetricsTab: function () { self.go('metrics') },
    goPublish: function () { self.startWizard() },
    ownerGrid: 'display:grid; grid-template-columns:repeat(auto-fit,minmax(' + (mobile ? '260px' : '420px') + ',1fr)); gap:14px;',
  }
}
