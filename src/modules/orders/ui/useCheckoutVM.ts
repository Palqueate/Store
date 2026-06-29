// @ts-nocheck
import { useFacade } from '@/shared/ui/vm/facade'

export function useCheckoutVM(): any {
  const self = useFacade()
  const s = self.state

  const mobile = s.vw < 860
  const cartItems = s.cart.map(function (it) { return self.cartItemVM(it) })
  const cSub = self.cartSubtotal()
  const cFee = Math.round(cSub * 0.04)
  const cTot = cSub + cFee

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

    // order summary
    cartItems: cartItems,
    cartSub: self.money(cSub),
    cartFee: self.money(cFee),
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
  }
}
