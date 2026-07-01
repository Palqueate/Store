// Disponibilidad de butacas por evento. Hoy la única modalidad de reserva es
// "asiento por evento": una butaca queda tomada para una función concreta
// (occurrenceId). La ocupación combina lo sembrado/persistido con lo que el
// carrito ya tiene reservado para ese palco, para que dos líneas no se pisen.
//
// (Las modalidades anuales — palco entero y asiento anual — se removieron del
//  producto; quedan como idea a futuro, ver PalcoModes.)
import type { Palco } from './Palco'
import type { OrderItem } from '@/modules/orders/domain/Order'

/** Butacas tomadas por función (occurrenceId → butacas). */
export interface PalcoOccupancy {
  seatEvent: Record<string, number[]>
}

function union(a: number[], b: number[]): number[] {
  const out = a.slice()
  ;(b || []).forEach((n) => { if (out.indexOf(n) < 0) out.push(n) })
  return out
}

/** Ocupación sembrada/persistida del palco (modes.seatEvent.taken), sin el carrito. */
export function palcoOccupancy(p: Palco): PalcoOccupancy {
  return { seatEvent: p.modes.seatEvent.taken || {} }
}

/**
 * Suma a `occ` lo que el CARRITO ya tiene reservado para este palco, de modo que
 * dos líneas del mismo carrito no puedan pisarse. `items` son las líneas del
 * carrito (de cualquier palco); sólo cuentan las de `palcoId`.
 */
export function withCart(occ: PalcoOccupancy, items: OrderItem[], palcoId: string): PalcoOccupancy {
  const next: PalcoOccupancy = { seatEvent: { ...occ.seatEvent } }
  ;(items || []).filter((it) => it.palcoId === palcoId).forEach((it) => {
    if (it.mode === 'seatEvent' && it.occurrenceId) {
      next.seatEvent[it.occurrenceId] = union(next.seatEvent[it.occurrenceId] || [], it.seats)
    }
  })
  return next
}

/** ¿Se puede reservar la butaca para una función puntual? No si ya está tomada
 *  para ESA función. */
export function seatEventAvailable(occ: PalcoOccupancy, seat: number, occurrenceId: string | null | undefined): boolean {
  if (!occurrenceId) return false
  return (occ.seatEvent[occurrenceId] || []).indexOf(seat) < 0
}

/** ¿Queda alguna butaca libre para una función dada? */
export function seatEventHasFree(p: Palco, occ: PalcoOccupancy, occurrenceId: string | null | undefined): boolean {
  if (!occurrenceId) return false
  for (let s = 1; s <= p.seats; s++) if (seatEventAvailable(occ, s, occurrenceId)) return true
  return false
}

/** Butacas libres para una función puntual. */
export function freeSeatsForEvent(p: Palco, occ: PalcoOccupancy, occurrenceId: string | null | undefined): number {
  if (!occurrenceId) return 0
  let n = 0
  for (let s = 1; s <= p.seats; s++) if (seatEventAvailable(occ, s, occurrenceId)) n++
  return n
}
