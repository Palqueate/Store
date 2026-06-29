// @ts-nocheck
import { useFacade } from '@/shared/ui/vm/facade'

export function useCartVM(): any {
  const self = useFacade()
  const s = self.state

  const mobile = s.vw < 860
  const cartItems = s.cart.map(function (it) { return self.cartItemVM(it) })
  const cSub = self.cartSubtotal()
  const cFee = Math.round(cSub * 0.04)
  const cTot = cSub + cFee

  return {
    cartEmpty: s.cart.length === 0,
    hasCartItems: s.cart.length > 0,
    cartItems: cartItems,
    cartSub: self.money(cSub),
    cartFee: self.money(cFee),
    cartTotal: self.money(cTot),
    cartCol: mobile
      ? 'display:flex; flex-direction:column; gap:18px;'
      : 'display:grid; grid-template-columns:minmax(0,1fr) 330px; gap:26px; align-items:start;',
    stickySum: mobile ? '' : 'position:sticky; top:88px;',
    goCheckout: function () { if (s.cart.length) self.go('checkout') },
    goExplore: function () { self.go('results') },
  }
}
