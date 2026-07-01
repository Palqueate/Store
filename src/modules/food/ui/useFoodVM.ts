import { useFacade } from '@/shared/ui/vm/facade'
import { chipS } from '@/shared/ui/vm/helpers'

export function useFoodVM(): any {
  const self = useFacade()
  const s = self.state

  const mobile = s.vw < 860
  const FOOD = s.foodCatalog
  const FOOD_CATS = s.foodCats
  const STADIUMS = s.stadiums

  const foodItems = FOOD.filter(function (f) { return s.foodCat === 'all' || f.cat === s.foodCat }).map(function (f) {
    var q = self.foodQty(f.id)
    var catName = (FOOD_CATS.find(function (c) { return c.id === f.cat }) || {}).name || ''
    return { id: f.id, name: f.name, desc: f.desc, price: self.money(f.price), qty: q, hasQty: q > 0, noQty: q === 0, catTag: catName.toUpperCase(),
      add: function () { self.addFood(f.id) }, dec: function () { self.decFood(f.id) } }
  })

  const foodCatChips = FOOD_CATS.map(function (c) { var on = s.foodCat === c.id; return { label: c.name, active: on, style: chipS(on), pick: function () { self.setFoodCat(c.id) } } })

  const fTotal = self.foodTotal()
  const fCount = self.foodCount()

  const foodLines = s.food.map(function (x) { var it = FOOD.find(function (f) { return f.id === x.id })!; return { name: it.name, qty: x.qty, price: self.money(it.price * x.qty), inc: function () { self.addFood(x.id) }, dec: function () { self.decFood(x.id) } } })

  const resCtx = (s.activeRes && s.activeRes.items[0]) ? { code: s.activeRes.code, palco: s.activeRes.items[0].palcoTitle, stadium: (STADIUMS[s.activeRes.items[0].stadium] || {}).name || s.activeRes.items[0].stadium } : { code: '—', palco: 'tu palco', stadium: 'el estadio' }

  // Origen del menú: al sumar snacks a una compra ya hecha se vuelve a "Mis
  // compras"; al hacerlo recién reservado, a la reserva.
  const fromAccount = s.foodFrom === 'account'

  const foodGrid = 'display:grid; grid-template-columns:repeat(auto-fill,minmax(' + (mobile ? '150px' : '212px') + ',1fr)); gap:14px;'
  const foodWrap = mobile ? 'display:flex; flex-direction:column; gap:18px;' : 'display:grid; grid-template-columns:minmax(0,1fr) 318px; gap:28px; align-items:start;'
  const stickySum = mobile ? '' : 'position:sticky; top:88px;'

  return {
    goConfirm: function () { self.go('confirm') },
    backLabel: fromAccount ? 'Volver a mis compras' : 'Volver a mi reserva',
    back: fromAccount ? function () { self.goAccount('compras') } : function () { self.go('confirm') },
    resCtx,
    foodWrap,
    foodCatChips,
    foodGrid,
    foodItems,
    stickySum,
    foodCount: fCount,
    foodEmpty: fCount === 0,
    hasFood: fCount > 0,
    foodLines,
    foodTotalTxt: self.money(fTotal),
    confirmFood: function () { self.confirmFood() },
  }
}
