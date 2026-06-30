import { useFacade } from '@/shared/ui/vm/facade'

export function useConfirmVM(): any {
  const self = useFacade()
  const s = self.state

  let conf: any = null
  if (s.activeRes) {
    const ar = s.activeRes
    conf = {
      code: ar.code,
      total: self.money(ar.total),
      subtotal: self.money(ar.subtotal),
      fee: self.money(ar.fee),
      name: (ar.contact && ar.contact.name) ? ar.contact.name : '',
      count: ar.items.length,
      items: ar.items.map(function (it) { return self.cartItemVM(it) }),
    }
  }

  return {
    conf: conf,
    goFood: function () { self.go('food') },
    goHome: function () { self.go('home') },
  }
}
