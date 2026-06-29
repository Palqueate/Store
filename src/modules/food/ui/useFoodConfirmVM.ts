// @ts-nocheck
import { useFacade } from '@/shared/ui/vm/facade'

export function useFoodConfirmVM(): any {
  const self = useFacade()
  const s = self.state

  const FOOD = s.foodCatalog
  const STADIUMS = s.stadiums

  const fTotal = self.foodTotal()

  const foodLines = s.food.map(function (x) { var it = FOOD.find(function (f) { return f.id === x.id }); return { name: it.name, qty: x.qty, price: self.money(it.price * x.qty), inc: function () { self.addFood(x.id) }, dec: function () { self.decFood(x.id) } } })

  const resCtx = (s.activeRes && s.activeRes.items[0]) ? { code: s.activeRes.code, palco: s.activeRes.items[0].palcoTitle, stadium: STADIUMS[s.activeRes.items[0].stadium].name } : { code: '—', palco: 'tu palco', stadium: 'el estadio' }

  return {
    resCtx,
    foodLines,
    foodTotalTxt: self.money(fTotal),
    goConfirm: function () { self.go('confirm') },
    goHome: function () { self.go('home') },
  }
}
