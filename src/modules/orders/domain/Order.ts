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
}

export interface Order {
  code: string
  userId: string
  subtotal: number
  fee: number
  total: number
  date: string
  contact: { name: string; email: string }
  food: Array<{ id: string; name: string; qty: number; price: number }>
  foodTotal: number
  items: OrderItem[]
}
