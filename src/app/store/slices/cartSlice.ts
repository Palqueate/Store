// Cart + food order: state, mutations, payment, and their selectors/VMs.
import { container } from '@/app/container'
import { createOrder, updateOrder } from '@/modules/orders/application/use-cases/orderUseCases'
import { eventOccurrence } from '@/modules/events/domain/Event'
import {
  palcoOccupancy, withCart, palcoYearAvailable, seatYearAvailable, seatEventAvailable,
} from '@/modules/palcos/domain/availability'
import { orderSnackable, todayISO } from '@/modules/orders/domain/snacks'
import type { Order, OrderItem } from '@/modules/orders/domain/Order'

export const createCartSlice = (set, get) => ({
  cart: [] as OrderItem[],
  // `food` es el borrador de snacks en edición: para el palco que se está
  // configurando en el detalle, o el de un ítem del carrito (ver snacksTarget).
  food: [] as { id: string; qty: number }[],
  // Destino del borrador de snacks: 'draft' (palco nuevo del detalle) o el uid
  // de un ítem del carrito que se está editando.
  snacksTarget: 'draft' as string,
  foodCat: 'all',
  contact: { name: '', email: '' } as { name: string; email: string },
  payMethod: 'card' as 'card' | 'transfer',
  paying: false,
  activeRes: null as Order | null,
  // De dónde se entró al menú de snacks: 'confirm' (recién reservado) o
  // 'account' (sumar snacks a una compra ya hecha). Define a dónde se vuelve.
  foodFrom: 'confirm' as 'confirm' | 'account',
  orders: [] as Order[], // placed orders (loaded by bootstrap, appended by pay)

  // ---- cart ----
  cartCount: () => get().cart.length,
  // Subtotal del palco (base de la comisión): palco + estacionamiento.
  cartSubtotal: () => get().cart.reduce((a, b) => a + b.price + (b.parkingTotal || 0), 0),
  // Snacks de todos los palcos del carrito (no pagan comisión).
  cartSnacksTotal: () => get().cart.reduce((a, b) => a + (b.snacksTotal || 0), 0),
  removeCart: (uid) => set({ cart: get().cart.filter((i) => i.uid !== uid) }),
  setContact: (f, v) => set({ contact: { ...get().contact, [f]: v } }),

  // ---- editar snacks de un ítem del carrito (inline, sin abrir el modal) ----
  // Reescribe los snacks de un ítem y recalcula su total.
  _setItemSnacks: (uid, snacks) => set({
    cart: get().cart.map((i) => i.uid === uid
      ? { ...i, snacks, snacksTotal: snacks.reduce((a, b) => a + b.price * b.qty, 0) }
      : i),
  }),
  incItemSnack: (uid, foodId) => {
    const item = get().cart.find((i) => i.uid === uid); if (!item) return
    const snacks = (item.snacks || []).map((sn) => sn.id === foodId ? { ...sn, qty: sn.qty + 1 } : sn)
    get()._setItemSnacks(uid, snacks)
  },
  decItemSnack: (uid, foodId) => {
    const item = get().cart.find((i) => i.uid === uid); if (!item) return
    const snacks = (item.snacks || []).map((sn) => sn.id === foodId ? { ...sn, qty: sn.qty - 1 } : sn).filter((sn) => sn.qty > 0)
    get()._setItemSnacks(uid, snacks)
  },
  removeItemSnack: (uid, foodId) => {
    const item = get().cart.find((i) => i.uid === uid); if (!item) return
    const snacks = (item.snacks || []).filter((sn) => sn.id !== foodId)
    get()._setItemSnacks(uid, snacks)
  },
  addToCart: () => {
    const s = get(); const p = get().byId(s.pId); if (!p) return
    // Disponibilidad cruzando modalidades (RN-11): lo sembrado + lo que ya hay en
    // el carrito para este palco. Es la validación autoritativa: aunque la UI
    // deshabilite lo no disponible, no se agrega nada que pise otra reserva.
    const occ = withCart(palcoOccupancy(p), get().cart, p.id)
    // Builder incremental del ítem (las claves de cada modalidad se agregan
    // según el caso); se valida contra OrderItem al hacer concat.
    const item: any = { uid: 'c' + Date.now() + Math.floor(Math.random() * 999), palcoId: p.id, palcoTitle: p.title, stadium: p.stadium }
    if (s.mode === 'palcoYear') {
      // RN-2: el palco entero exige todas las butacas libres en toda la temporada.
      if (!palcoYearAvailable(occ)) return get().flash('El palco tiene reservas activas: no se puede alquilar entero por el año')
      item.mode = 'palcoYear'; item.modeLabel = 'Palco entero · 1 año'; item.seats = []; item.term = 'Temporada 2026 · 1 año'; item.qty = 1; item.price = p.modes.palcoYear.price
    }
    else if (s.mode === 'seatYear') {
      if (!s.seats.length) return get().flash('Elegí al menos un asiento')
      // RN-1/RN-3: la butaca anual no puede estar tomada ni por el año ni en ningún evento.
      const bad = s.seats.filter((n) => !seatYearAvailable(occ, n)).sort((a, b) => a - b)
      if (bad.length) return get().flash('Asiento' + (bad.length > 1 ? 's' : '') + ' ' + bad.join(', ') + ' no disponible' + (bad.length > 1 ? 's' : '') + ' por el año')
      item.mode = 'seatYear'; item.modeLabel = 'Asiento anual · 1 año'; item.seats = s.seats.slice().sort((a, b) => a - b); item.term = 'Temporada 2026 · 1 año'; item.qty = s.seats.length; item.price = p.modes.seatYear.price * s.seats.length
    }
    else {
      if (!s.seats.length) return get().flash('Elegí al menos un asiento')
      // RN-1/RN-3: la butaca por evento no puede estar tomada por el año ni en esa función.
      const bad = s.seats.filter((n) => !seatEventAvailable(occ, n, s.occurrenceId)).sort((a, b) => a - b)
      if (bad.length) return get().flash('Asiento' + (bad.length > 1 ? 's' : '') + ' ' + bad.join(', ') + ' no disponible' + (bad.length > 1 ? 's' : '') + ' para esta función')
      const ev = get().events.find((e) => e.id === s.eventId); const occu = ev ? eventOccurrence(ev, s.occurrenceId) : null; item.mode = 'seatEvent'; item.modeLabel = 'Asiento · por evento'; item.seats = s.seats.slice().sort((a, b) => a - b); item.eventId = s.eventId; item.occurrenceId = s.occurrenceId; item.eventLabel = ev ? (ev.comp + (ev.round ? (' · ' + ev.round) : '')) : ''; item.eventOpp = ev ? ev.opp : ''; item.term = occu ? (occu.day + ' ' + occu.month + ' · ' + occu.time + ' hs') : ''; item.qty = s.seats.length; item.price = p.modes.seatEvent.price * s.seats.length
    }
    // Estacionamiento como add-on de la reserva (no afecta item.price; se suma aparte).
    const parkAvail = p.parking.has ? p.parking.n : 0
    const parkSel = Math.max(0, Math.min(parkAvail, s.parkSel || 0))
    if (parkSel > 0) { item.parkingQty = parkSel; item.parkingPrice = p.parking.price || 0; item.parkingTotal = parkSel * (p.parking.price || 0) }
    // Los snacks se agregan después, por palco, desde el carrito (no en el detalle).
    set({ cart: get().cart.concat([item]), parkSel: 0 })
    get().flash('Reserva agregada al carrito'); get().go('cart')
  },
  pay: (forceUser?) => {
    const user = forceUser || get().user
    if (!user) { set({ pendingPay: true }); get().openAuth('login'); return }
    if (!get().cart.length || get().paying) return
    set({ paying: true })
    setTimeout(() => {
      const sub = get().cartSubtotal(), fee = Math.round(sub * 0.04)
      // Snacks iniciales (por palco): se cobran junto con la reserva, sin
      // comisión (RN-15). El total = subtotal palco + comisión + snacks.
      const snacksTot = get().cartSnacksTotal()
      const total = sub + fee + snacksTot
      const code = 'PLQ-' + Math.random().toString(36).slice(2, 6).toUpperCase()
      // food/foodTotal quedan vacíos: son los snacks POST-reserva (cobro aparte).
      const order = { code, userId: user.id, items: get().cart.slice(), subtotal: sub, fee, total, date: new Date().toISOString(), contact: { name: user.name, email: user.email }, food: [], foodTotal: 0, snacksTotal: snacksTot }
      const orders = get().orders.concat([order]); createOrder(container.orders, order)
      set({ orders, activeRes: order, cart: [], food: [], snacksTarget: 'draft', foodFrom: 'confirm', paying: false })
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
    const qtyNote = (it.mode !== 'palcoYear' && seatQty > 1) ? (' · ' + get().money(seatUnit) + ' × ' + seatQty + ' asientos') : ''
    const parkingUnitNote = (hasParking && it.parkingQty > 1) ? (' · ' + get().money(it.parkingPrice) + ' × ' + it.parkingQty + ' estacionamientos') : ''
    // Snacks de este palco (botana y bebidas).
    const snacks = it.snacks || []
    const hasSnacks = snacks.length > 0
    const snackCount = snacks.reduce((a, b) => a + b.qty, 0)
    const snackLines = snacks.map((sn) => ({
      id: sn.id, name: sn.name, qty: sn.qty, price: get().money(sn.price * sn.qty),
      inc: () => get().incItemSnack(it.uid, sn.id),
      dec: () => get().decItemSnack(it.uid, sn.id),
      remove: () => get().removeItemSnack(it.uid, sn.id),
    }))
    return {
      uid: it.uid, title: it.palcoTitle, stadiumName: get().stadiums[it.stadium].name, modeLabel: it.modeLabel, seatsText, meta, tag,
      baseLabel: seatsText, qtyNote,
      price: get().money(it.price), remove: () => get().removeCart(it.uid),
      hasParking,
      parkingText: hasParking ? ('Estacionamiento · ' + it.parkingQty + (it.parkingQty > 1 ? ' lugares' : ' lugar')) : '',
      parkingUnitNote,
      parkingPrice: hasParking ? get().money(it.parkingTotal) : '',
      hasSnacks, snackCount, snackLines,
      snacksTotalTxt: hasSnacks ? get().money(it.snacksTotal) : '',
      editSnacks: () => get().openSnacksForItem(it.uid),
      lineTotal: get().money(it.price + (it.parkingTotal || 0) + (it.snacksTotal || 0)),
    }
  },

  // ---- food / snacks draft ----
  foodQty: (id) => { const f = get().food.find((x) => x.id === id); return f ? f.qty : 0 },
  foodCount: () => get().food.reduce((a, b) => a + b.qty, 0),
  foodTotal: () => { const FOOD = get().foodCatalog; return get().food.reduce((a, b) => { const it = FOOD.find((f) => f.id === b.id); return a + (it ? it.price * b.qty : 0) }, 0) },
  setFoodCat: (c) => set({ foodCat: c }),
  addFood: (id) => { const arr = get().food.map((x) => ({ ...x })); const f = arr.find((x) => x.id === id); if (f) f.qty++; else arr.push({ id, qty: 1 }); set({ food: arr }) },
  decFood: (id) => { const arr = get().food.map((x) => ({ ...x })); const i = arr.findIndex((x) => x.id === id); if (i >= 0) { arr[i].qty--; if (arr[i].qty <= 0) arr.splice(i, 1) } set({ food: arr }) },

  // Snapshot del borrador de snacks (food) con nombre y precio del catálogo.
  _snackSnapshot: () => {
    const FOOD = get().foodCatalog
    const list = get().food.map((x) => { const it = FOOD.find((f) => f.id === x.id)!; return { id: x.id, name: it.name, qty: x.qty, price: it.price } })
    const total = list.reduce((a, b) => a + b.price * b.qty, 0)
    return { list, total }
  },

  // ---- snacks modal (por palco, desde el carrito) ----
  // Edita los snacks de un ítem del carrito (carga su selección en el borrador).
  openSnacksForItem: (uid) => {
    const item = get().cart.find((i) => i.uid === uid); if (!item) return
    const draft = (item.snacks || []).map((sn) => ({ id: sn.id, qty: sn.qty }))
    set({ food: draft, foodCat: 'all', snacksTarget: uid, snacksModal: true })
  },
  closeSnacks: () => {
    const target = get().snacksTarget
    if (target && target !== 'draft') {
      // Confirmar la edición: escribir el borrador en el ítem del carrito.
      const snap = get()._snackSnapshot()
      const cart = get().cart.map((i) => i.uid === target ? { ...i, snacks: snap.list, snacksTotal: snap.total } : i)
      set({ cart, food: [], snacksTarget: 'draft', snacksModal: false })
    } else {
      // Borrador del detalle: se mantiene para adjuntarlo al reservar.
      set({ snacksModal: false })
    }
  },
  // Sumar snacks a una compra YA hecha (cualquiera de las 3 modalidades): se
  // toma esa orden como reserva activa y se abre el menú con el pedido en
  // blanco. confirmFood la actualiza igual que a una reserva recién pagada.
  addSnacksToOrder: (code) => {
    const order = get().orders.find((o) => o.code === code); if (!order) return
    // Sólo si el evento todavía no pasó: no se sirve botana para algo ya ocurrido.
    if (!orderSnackable(order, get().events, todayISO())) return get().flash('El evento ya pasó: no se puede sumar botana')
    set({ activeRes: order, food: [], foodCat: 'all', foodFrom: 'account' })
    get().go('food')
  },
  confirmFood: () => {
    if (!get().foodCount()) return get().flash('Agregá algo al pedido')
    const foodCatalog = get().foodCatalog
    const foodArr = get().food.map((x) => { const it = foodCatalog.find((f) => f.id === x.id); return { id: x.id, name: it.name, qty: x.qty, price: it.price } })
    const fTot = get().foodTotal(); let ar = get().activeRes; let orders = get().orders
    if (ar) { orders = orders.map((o) => o.code === ar.code ? { ...o, food: (o.food || []).concat(foodArr), foodTotal: (o.foodTotal || 0) + fTot } : o); ar = { ...ar, food: (ar.food || []).concat(foodArr), foodTotal: (ar.foodTotal || 0) + fTot }; updateOrder(container.orders, ar) }
    set({ orders, activeRes: ar }); get().go('foodConfirm')
  },
})
