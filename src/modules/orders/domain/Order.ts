export interface OrderItem {
  uid: string
  palcoId: string
  palcoTitle: string
  stadium: string
  mode: 'palcoYear' | 'seatYear' | 'seatEvent'
  modeLabel: string
  seats: number[]
  term: string
  qty: number
  price: number
  eventId?: string
  /** Función (fecha + hora) del evento. Coincide con eventId si es de fecha única. */
  occurrenceId?: string
  eventLabel?: string
  eventOpp?: string
  /** Estacionamiento alquilado junto a la reserva (add-on). */
  parkingQty?: number
  /** Precio por lugar de estacionamiento al momento de reservar. */
  parkingPrice?: number
  /** Costo total del estacionamiento del ítem (parkingQty × parkingPrice). */
  parkingTotal?: number
  /** Botana y bebidas elegidas para ESTE palco (snapshot al reservar). */
  snacks?: Array<{ id: string; name: string; qty: number; price: number }>
  /** Costo total de los snacks del ítem. */
  snacksTotal?: number
}

export interface Order {
  code: string
  userId: string
  subtotal: number
  fee: number
  total: number
  date: string
  contact: { name: string; email: string }
  /** Snacks agregados DESPUÉS de la reserva (cobro aparte, post-reserva). */
  food: Array<{ id: string; name: string; qty: number; price: number }>
  foodTotal: number
  /** Snacks iniciales: suma de los snacks por palco (items[].snacksTotal). */
  snacksTotal?: number
  items: OrderItem[]
}
