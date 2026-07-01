// Reglas para sumar botana (snacks) a una compra ya hecha.
//
// No tiene sentido pedir botana para un evento que ya ocurrió: sólo se puede
// agregar mientras la fecha de la función todavía no pasó (el día del evento
// cuenta como vigente).
import type { Order, OrderItem } from './Order'
import type { Ev } from '@/modules/events/domain/Event'
import { eventOccurrence } from '@/modules/events/domain/Event'

/** Fecha local de hoy en formato ISO (YYYY-MM-DD), para comparar con `iso`. */
export function todayISO(): string {
  const n = new Date()
  return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0')
}

/** Fecha (YYYY-MM-DD) de la función de un ítem; null si no se puede determinar
 *  (evento ausente / sin fecha). */
function itemEventDate(item: OrderItem, events: Ev[]): string | null {
  const ev = events.find((e) => e.id === item.eventId)
  if (!ev) return null
  const occ = eventOccurrence(ev, item.occurrenceId)
  return (occ && occ.iso) ? occ.iso : null
}

/**
 * ¿Se le puede sumar botana a esta compra? Sí mientras quede alguna función por
 * venir: un ítem cuya fecha de evento no pasó (el día del evento todavía cuenta).
 * Una compra deja de admitir botana cuando todas sus funciones ya pasaron.
 */
export function orderSnackable(order: Order, events: Ev[], today: string): boolean {
  return (order.items || []).some((it) => {
    const d = itemEventDate(it, events)
    return d == null || d >= today
  })
}
