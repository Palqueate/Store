// Cart + food order: state, mutations, payment, and their selectors/VMs.
import { container } from '@/app/container'
import { createOrder, updateOrder } from '@/modules/orders/application/use-cases/orderUseCases'
import { eventOccurrence } from '@/modules/events/domain/Event'
import type { Order, OrderItem } from '@/modules/orders/domain/Order'

export const createCartSlice = (set, get) => ({
  cart: [] as OrderItem[],
  food: [] as { id: string; qty: number }[], // in-progress food order (NOT the catalog)
  foodCat: 'all',
  contact: { name: '', email: '' } as { name: string; email: string },
  payMethod: 'card' as 'card' | 'transfer',
  paying: false,
  activeRes: null as Order | null,
  orders: [] as Order[], // placed orders (loaded by bootstrap, appended by pay)

  // ---- cart ----
  cartCount: () => get().cart.length + get().food.reduce((a, b) => a + b.qty, 0),
  cartSubtotal: () => get().cart.reduce((a, b) => a + b.price + (b.parkingTotal || 0), 0),
  removeCart: (uid) => set({ cart: get().cart.filter((i) => i.uid !== uid) }),
  setContact: (f, v) => set({ contact: { ...get().contact, [f]: v } }),
  addToCart: () => {
    const s = get(); const p = get().byId(s.pId); if (!p) return
    // Builder incremental del ítem (las claves de cada modalidad se agregan
    // según el caso); se valida contra OrderItem al hacer concat.
    const item: any = { uid: 'c' + Date.now() + Math.floor(Math.random() * 999), palcoId: p.id, palcoTitle: p.title, stadium: p.stadium }
    if (s.mode === 'palcoYear') { item.mode = 'palcoYear'; item.modeLabel = 'Palco entero · 1 año'; item.seats = []; item.term = 'Temporada 2026 · 1 año'; item.qty = 1; item.price = p.modes.palcoYear.price }
    else if (s.mode === 'seatYear') { if (!s.seats.length) return get().flash('Elegí al menos un asiento'); item.mode = 'seatYear'; item.modeLabel = 'Asiento anual · 1 año'; item.seats = s.seats.slice().sort((a, b) => a - b); item.term = 'Temporada 2026 · 1 año'; item.qty = s.seats.length; item.price = p.modes.seatYear.price * s.seats.length }
    else { if (!s.seats.length) return get().flash('Elegí al menos un asiento'); const ev = get().events.find((e) => e.id === s.eventId); const occ = ev ? eventOccurrence(ev, s.occurrenceId) : null; item.mode = 'seatEvent'; item.modeLabel = 'Asiento · por evento'; item.seats = s.seats.slice().sort((a, b) => a - b); item.eventId = s.eventId; item.occurrenceId = s.occurrenceId; item.eventLabel = ev ? (ev.comp + (ev.round ? (' · ' + ev.round) : '')) : ''; item.eventOpp = ev ? ev.opp : ''; item.term = occ ? (occ.day + ' ' + occ.month + ' · ' + occ.time + ' hs') : ''; item.qty = s.seats.length; item.price = p.modes.seatEvent.price * s.seats.length }
    // Estacionamiento como add-on de la reserva (no afecta item.price; se suma aparte).
    const parkAvail = p.parking.has ? p.parking.n : 0
    const parkSel = Math.max(0, Math.min(parkAvail, s.parkSel || 0))
    if (parkSel > 0) { item.parkingQty = parkSel; item.parkingPrice = p.parking.price || 0; item.parkingTotal = parkSel * (p.parking.price || 0) }
    set({ cart: get().cart.concat([item]), parkSel: 0 })
    get().flash('Reserva agregada al carrito'); get().go('cart')
  },
  pay: (forceUser?) => {
    const user = forceUser || get().user
    if (!user) { set({ pendingPay: true }); get().openAuth('login'); return }
    if (!get().cart.length || get().paying) return
    set({ paying: true })
    setTimeout(() => {
      const sub = get().cartSubtotal(), fee = Math.round(sub * 0.04), total = sub + fee
      const code = 'PLQ-' + Math.random().toString(36).slice(2, 6).toUpperCase()
      const order = { code, userId: user.id, items: get().cart.slice(), subtotal: sub, fee, total, date: new Date().toISOString(), contact: { name: user.name, email: user.email }, food: [], foodTotal: 0 }
      const orders = get().orders.concat([order]); createOrder(container.orders, order)
      set({ orders, activeRes: order, cart: [], paying: false })
      get().go('confirm')
    }, 1300)
  },
  cartItemVM: (it) => {
    let seatsText, meta
    if (it.mode === 'palcoYear') { const pp = get().byId(it.palcoId); seatsText = 'Palco completo' + (pp ? (' · ' + pp.seats + ' asientos') : ''); meta = 'Temporada 2026 · 1 año' }
    else if (it.mode === 'seatYear') { seatsText = 'Asiento' + (it.seats.length > 1 ? 's' : '') + ' ' + it.seats.join(' · '); meta = 'Temporada 2026 · 1 año' }
    else { seatsText = 'Asiento' + (it.seats.length > 1 ? 's' : '') + ' ' + it.seats.join(' · '); meta = it.eventLabel }
    const tag = it.mode === 'palcoYear' ? 'PALCO' : 'ASIENTO'
    const hasParking = !!(it.parkingQty && it.parkingQty > 0)
    // Nota de unitario × cantidad cuando hay más de una unidad, para que el
    // importe de cada línea sea verificable de un vistazo.
    const seatQty = it.qty || (it.seats ? it.seats.length : 1)
    const seatUnit = seatQty > 0 ? Math.round(it.price / seatQty) : it.price
    const qtyNote = (it.mode !== 'palcoYear' && seatQty > 1) ? (' · ' + get().money(seatUnit) + ' × ' + seatQty) : ''
    const parkingUnitNote = (hasParking && it.parkingQty > 1) ? (' · ' + get().money(it.parkingPrice) + ' × ' + it.parkingQty) : ''
    return {
      uid: it.uid, title: it.palcoTitle, stadiumName: get().stadiums[it.stadium].name, modeLabel: it.modeLabel, seatsText, meta, tag,
      baseLabel: seatsText, qtyNote,
      price: get().money(it.price), remove: () => get().removeCart(it.uid),
      hasParking,
      parkingText: hasParking ? ('Estacionamiento · ' + it.parkingQty + (it.parkingQty > 1 ? ' lugares' : ' lugar')) : '',
      parkingUnitNote,
      parkingPrice: hasParking ? get().money(it.parkingTotal) : '',
      lineTotal: get().money(it.price + (it.parkingTotal || 0)),
    }
  },

  // ---- food order ----
  foodQty: (id) => { const f = get().food.find((x) => x.id === id); return f ? f.qty : 0 },
  foodCount: () => get().food.reduce((a, b) => a + b.qty, 0),
  foodTotal: () => { const FOOD = get().foodCatalog; return get().food.reduce((a, b) => { const it = FOOD.find((f) => f.id === b.id); return a + (it ? it.price * b.qty : 0) }, 0) },
  setFoodCat: (c) => set({ foodCat: c }),
  addFood: (id) => { const arr = get().food.map((x) => ({ ...x })); const f = arr.find((x) => x.id === id); if (f) f.qty++; else arr.push({ id, qty: 1 }); set({ food: arr }) },
  decFood: (id) => { const arr = get().food.map((x) => ({ ...x })); const i = arr.findIndex((x) => x.id === id); if (i >= 0) { arr[i].qty--; if (arr[i].qty <= 0) arr.splice(i, 1) } set({ food: arr }) },
  confirmFood: () => {
    if (!get().foodCount()) return get().flash('Agregá algo al pedido')
    const foodCatalog = get().foodCatalog
    const foodArr = get().food.map((x) => { const it = foodCatalog.find((f) => f.id === x.id); return { id: x.id, name: it.name, qty: x.qty, price: it.price } })
    const fTot = get().foodTotal(); let ar = get().activeRes; let orders = get().orders
    if (ar) { orders = orders.map((o) => o.code === ar.code ? { ...o, food: (o.food || []).concat(foodArr), foodTotal: (o.foodTotal || 0) + fTot } : o); ar = { ...ar, food: (ar.food || []).concat(foodArr), foodTotal: (ar.foodTotal || 0) + fTot }; updateOrder(container.orders, ar) }
    set({ orders, activeRes: ar }); get().go('foodConfirm')
  },
})
