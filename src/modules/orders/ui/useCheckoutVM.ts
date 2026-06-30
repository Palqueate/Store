import { useFacade } from '@/shared/ui/vm/facade'
import { chipS } from '@/shared/ui/vm/helpers'

export function useCheckoutVM(): any {
  const self = useFacade()
  const s = self.state

  const mobile = s.vw < 860
  const cartItems = s.cart.map(function (it) { return self.cartItemVM(it) })
  const cSub = self.cartSubtotal()
  const cFee = Math.round(cSub * 0.04)

  // ---- Snacks iniciales (opcional, antes de pagar) ----
  const FOOD = s.foodCatalog
  const FOOD_CATS = s.foodCats
  const snackItems = FOOD.filter(function (f) { return s.foodCat === 'all' || f.cat === s.foodCat }).map(function (f) {
    var q = self.foodQty(f.id)
    var catName = (FOOD_CATS.find(function (c) { return c.id === f.cat }) || {}).name || ''
    return {
      id: f.id, name: f.name, desc: f.desc, price: self.money(f.price), qty: q, hasQty: q > 0, noQty: q === 0, catTag: catName.toUpperCase(),
      add: function () { self.addFood(f.id) }, dec: function () { self.decFood(f.id) },
    }
  })
  const snackCatChips = [{ id: 'all', name: 'Todas' }].concat(FOOD_CATS).map(function (c) {
    var on = s.foodCat === c.id
    return { label: c.name, active: on, style: chipS(on), pick: function () { self.setFoodCat(c.id) } }
  })
  const snackLines = s.food.map(function (x) {
    var it = FOOD.find(function (f) { return f.id === x.id })!
    return { id: x.id, name: it.name, qty: x.qty, price: self.money(it.price * x.qty), inc: function () { self.addFood(x.id) }, dec: function () { self.decFood(x.id) } }
  })
  const fCount = self.foodCount()
  const fTotal = self.foodTotal()

  const cTot = cSub + cFee + fTotal

  return {
    // navigation
    goCart: function () { self.go('cart') },
    loggedOut: !s.user,
    openLogin: function () { self.openAuth('login') },
    openRegister: function () { self.openAuth('register') },

    // contact form
    contactName: s.contact.name,
    contactEmail: s.contact.email,
    setName: function (e) { self.setContact('name', e.target.value) },
    setEmail: function (e) { self.setContact('email', e.target.value) },

    // payment method — not in legacyVals; provide safe defaults
    payMethod: s.payMethod ?? 'card',
    setPayMethod: function (v) { self.setState({ payMethod: v }) },

    // snacks (botana y bebidas) antes de pagar
    snackItems,
    snackCatChips,
    snackLines,
    snackCount: fCount,
    hasSnacks: fCount > 0,
    snacksTotal: self.money(fTotal),

    // order summary
    cartItems: cartItems,
    cartSub: self.money(cSub),
    cartFee: self.money(cFee),
    hasSnacksLine: fCount > 0,
    cartTotal: self.money(cTot),

    // pay action
    pay: function () { self.pay() },
    paying: s.paying,
    payLabel: s.paying ? 'Procesando pago…' : ('Pagar ' + self.money(cTot)),

    // layout
    checkoutCol: mobile
      ? 'display:flex; flex-direction:column; gap:18px;'
      : 'display:grid; grid-template-columns:minmax(0,1fr) 350px; gap:30px; align-items:start;',
    stickySum: mobile ? '' : 'position:sticky; top:88px;',
    snackGrid: 'display:grid; grid-template-columns:repeat(auto-fill,minmax(' + (mobile ? '150px' : '180px') + ',1fr)); gap:12px;',
  }
}
