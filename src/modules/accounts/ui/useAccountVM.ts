import { useFacade } from '@/shared/ui/vm/facade'
import { orderSnackable, todayISO } from '@/modules/orders/domain/snacks'
import type { User } from '@/modules/accounts/domain/User'

export function useAccountVM(): any {
  const self = useFacade()
  const s = self.state

  var uu = s.user || ({} as User)
  var pf = s.profileDraft || ({} as Partial<User>)
  var nf = uu.notif || {}

  var rawOrders = self.myOrders()
  var acctTotalSpent = rawOrders.reduce(function (a, o) { return a + (o.total || 0) + (o.foodTotal || 0) }, 0)
  var acctReservas = rawOrders.reduce(function (a, o) { return a + o.items.reduce(function (x, it) { return x + (it.mode === 'palcoYear' ? 1 : (it.seats ? it.seats.length : (it.qty || 1))) }, 0) }, 0)

  var today = todayISO()

  var myOrders = self.myOrders().map(function (o) {
    // Botana sólo si el evento todavía no pasó (los alquileres anuales valen
    // toda la temporada). Si pasó, se muestra deshabilitado con su motivo.
    var canSnack = orderSnackable(o, s.events, today)
    return {
      code: o.code,
      date: (function () { try { return new Date(o.date).toLocaleDateString('es-UY', { day: '2-digit', month: 'short', year: 'numeric' }) } catch (e) { return '' } })(),
      total: self.money((o.total || 0) + (o.foodTotal || 0)),
      itemCount: o.items.length,
      items: o.items.map(function (it) { return self.cartItemVM(it) }),
      hasFood: !!(o.food && o.food.length),
      foodLines: (o.food || []).map(function (f) { return { name: f.name, qty: f.qty, price: self.money(f.price * f.qty) } }),
      foodTotalTxt: self.money(o.foodTotal || 0),
      // Sumar más botana y bebidas a esta compra (cualquier modalidad), sólo si
      // el evento todavía no pasó.
      canAddSnacks: canSnack,
      addSnacks: function () { self.addSnacksToOrder(o.code) },
    }
  })


  return {
    // tabs
    acctTabPerfil: s.acctTab === 'perfil',
    acctTabCompras: s.acctTab === 'compras',
    setAcctPerfil: function () { self.setState({ acctTab: 'perfil' }) },
    setAcctCompras: function () { self.setState({ acctTab: 'compras' }) },

    // header / photo
    acctPhoto: uu.photo || null,
    acctHasPhoto: !!uu.photo,
    acctVerified: !!uu.verified,
    onPhotoPick: function (e) { self.onPhotoPick(e) },
    removePhoto: function () { self.removePhoto() },

    // user identity
    userName: s.user ? s.user.name : '',
    userEmail: s.user ? s.user.email : '',
    userInitials: s.user ? (s.user.name.trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0) }).join('').toUpperCase()) : '',
    memberSince: (s.user && s.user.joined) ? new Date(s.user.joined).toLocaleDateString('es-UY', { month: 'long', year: 'numeric' }) : '',

    // stats
    acctStats: [
      { label: 'PUNTOS PALQUEATE', value: (uu.points || 0).toLocaleString('es-UY'), icon: 'star', accent: true },
      { label: 'RESERVAS', value: String(acctReservas) },
      { label: 'TOTAL GASTADO', value: self.money(acctTotalSpent) },
    ],

    // editable draft fields — personal
    pfName: pf.name || '',
    pfEmail: pf.email || '',
    pfPhone: pf.phone || '',
    pfCi: pf.ci || '',
    pfBirth: pf.birth || '',
    pfCity: pf.city || '',
    pfAddress: pf.address || '',
    pfCountry: pf.country || '',
    setPfName: function (e) { self.setProfileField('name', e.target.value) },
    setPfEmail: function (e) { self.setProfileField('email', e.target.value) },
    setPfPhone: function (e) { self.setProfileField('phone', e.target.value) },
    setPfCi: function (e) { self.setProfileField('ci', e.target.value) },
    setPfBirth: function (e) { self.setProfileField('birth', e.target.value) },
    setPfCity: function (e) { self.setProfileField('city', e.target.value) },
    setPfAddress: function (e) { self.setProfileField('address', e.target.value) },
    setPfCountry: function (e) { self.setProfileField('country', e.target.value) },
    saveProfile: function () { self.saveProfileDraft() },

    // preferences
    favStadiumVal: uu.favStadium || 'gpc',
    setFavStadium: function (e) { self.setFavStadium(e.target.value) },
    langVal: uu.lang || 'Español (UY)',
    setLang: function (e) { self.setLang(e.target.value) },

    // notifications
    notifEmail: !!nf.email,
    notifSms: !!nf.sms,
    notifPush: !!nf.push,
    notifPromos: !!nf.promos,
    toggleNotifEmail: function () { self.toggleNotif('email') },
    toggleNotifSms: function () { self.toggleNotif('sms') },
    toggleNotifPush: function () { self.toggleNotif('push') },
    toggleNotifPromos: function () { self.toggleNotif('promos') },

    // payment card
    cardBrand: (uu.card && uu.card.brand) || '—',
    cardLast4: (uu.card && uu.card.last4) || '••••',
    cardExp: (uu.card && uu.card.exp) || '',
    cardName: (uu.card && uu.card.name) || '',

    // orders (compras tab)
    myOrders: myOrders,
    hasOrders: myOrders.length > 0,
    noOrdersAcct: myOrders.length === 0,

    // navigation
    goEvents: function () { self.goEvents() },

    // session
    doLogout: function () { self.logout() },
  }
}
