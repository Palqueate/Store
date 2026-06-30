// Reglas para sumar botana (snacks) a una compra ya hecha.
//
// No tiene sentido pedir botana para un evento que ya ocurrió: sólo se puede
// agregar mientras quede algo por venir. Los alquileres anuales (palco entero
// y asiento anual) cubren toda la temporada, así que siguen habilitados; los
// asientos por evento, sólo si la fecha de la función todavía no pasó.
import type { Order, OrderItem } from './Order'
import type { Ev } from '@/modules/events/domain/Event'
import { eventOccurrence } from '@/modules/events/domain/Event'

/** Fecha local de hoy en formato ISO (YYYY-MM-DD), para comparar con `iso`. */
export function todayISO(): string {
  const n = new Date()
  return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0')
}

/** Fecha (YYYY-MM-DD) de la función de un ítem por evento; null para los modos
 *  anuales o cuando no se puede determinar (evento ausente / sin fecha). */
function itemEventDate(item: OrderItem, events: Ev[]): string | null {
  if (item.mode !== 'seatEvent') return null
  const ev = events.find((e) => e.id === item.eventId)
  if (!ev) return null
  const occ = eventOccurrence(ev, item.occurrenceId)
  return (occ && occ.iso) ? occ.iso : null
}

/**
 * ¿Se le puede sumar botana a esta compra? Sí mientras quede algún ítem vigente:
 *  · alquiler anual (palco entero / asiento anual) → temporada en curso, vale.
 *  · asiento por evento → sólo si la fecha de la función no pasó (el día del
 *    evento todavía cuenta como vigente).
 * Una compra deja de admitir botana cuando TODOS sus ítems son por evento y
 * todas esas funciones ya pasaron.
 */
export function orderSnackable(order: Order, events: Ev[], today: string): boolean {
  return (order.items || []).some((it) => {
    if (it.mode !== 'seatEvent') return true
    const d = itemEventDate(it, events)
    return d == null || d >= today
  })
}
