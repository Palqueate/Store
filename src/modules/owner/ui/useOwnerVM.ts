import { useFacade } from '@/shared/ui/vm/facade'
import { statusBadge, tabS } from '@/shared/ui/vm/helpers'

export function useOwnerVM(): any {
  const self = useFacade()
  const s = self.state
  var STADIUMS = s.stadiums
  var mobile = s.vw < 860

  var badgeTone = { publicado: 'success', pausado: 'warn', pendiente: 'warn', rechazado: 'danger', alquilado: 'neutral' }

  var owned = self.allPalcos().filter(function (p) { return p.host === 'Vos (demo)' }).map(function (p) {
    var st = self.statusOf(p); var b = statusBadge(st)
    var modes: string[] = []; if (p.modes.seatEvent.on) modes.push('Por evento')
    var fp = self.fromPrice(p)
    var isRejected = st === 'rechazado'
    var review = (isRejected && p.review) ? {
      reason: p.review.reason || '',
      fields: (p.review.fields || []).map(function (f) {
        return {
          key: f.key, label: f.label, reason: f.reason, reply: f.ownerReply || '',
          setReply: function (v) { self.setPalcoFieldReply(p.id, f.key, v) },
        }
      }),
    } : null
    return {
      id: p.id, title: p.title, stadiumName: STADIUMS[p.stadium].name, sector: p.sector, seats: p.seats,
      parking: p.parking.has ? (p.parking.n + (p.parking.n > 1 ? ' autos' : ' auto')) : 'Sin estac.',
      statusLabel: b.lbl, statusStyle: b.style, badgeTone: badgeTone[st] || 'neutral',
      isPaused: st === 'pausado', isPending: st === 'pendiente', isRejected: isRejected,
      canToggle: st === 'publicado' || st === 'pausado', review: review, modes: modes,
      priceTxt: self.money(fp.v), priceLabel: fp.l, toggleLabel: st === 'pausado' ? 'Reanudar' : 'Pausar',
      toggle: function () { self.togglePublish(p.id) }, view: function () { self.openDetail(p.id) },
      edit: function () { self.startEditWizard(p.id) },
      resubmit: function () { self.resubmitPalco(p.id) },
    }
  })

  // Recaudación estimada: butacas vendidas por evento × precio, por cada palco.
  var ownIncome = owned.reduce(function (a, o) {
    var pp = self.byId(o.id); if (!pp) return a
    var taken = pp.modes.seatEvent.taken || {}
    var sold = Object.keys(taken).reduce(function (n, k) { return n + (taken[k] || []).length }, 0)
    return a + sold * (pp.modes.seatEvent.on ? pp.modes.seatEvent.price : 0)
  }, 0)

  var ownerStats = [
    { label: 'PALCOS', value: String(owned.length) },
    { label: 'PUBLICADOS', value: String(owned.filter(function (o) { return o.statusLabel === 'Publicado' }).length) },
    { label: 'RECAUDACIÓN EST.', value: self.money(ownIncome) },
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
