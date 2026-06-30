// Disponibilidad de butacas cruzando las TRES modalidades de un palco (RN-11).
//
// El alquiler de un palco puede solaparse entre modalidades, así que la
// ocupación de una tapa a las otras:
//   · palcoYear  → el palco ENTERO por la temporada. Tapa TODO.
//   · seatYear   → una butaca por TODA la temporada. Tapa esa butaca en el año
//                  y en cualquier función de la temporada.
//   · seatEvent  → una butaca para UNA función puntual. Tapa esa butaca en esa
//                  función y, hacia el año, impide alquilarla por la temporada.
//
// Reglas que impone este módulo:
//   1. Palco entero anual tomado → no se vende ni asiento anual ni por evento.
//   2. Cualquier butaca reservada (anual o por evento) → no se alquila el palco
//      entero por el año.
//   3. Butaca tomada por un evento → no se reserva esa butaca por el año (y, a la
//      inversa, una butaca anual no se reserva para ningún evento).
import type { Palco } from './Palco'
import type { OrderItem } from '@/modules/orders/domain/Order'

/** Qué hay reservado en un palco y, por lo tanto, qué bloquea otras reservas. */
export interface PalcoOccupancy {
  /** El palco entero está alquilado por la temporada. */
  palcoYear: boolean
  /** Butacas alquiladas por la temporada completa. */
  seatYear: number[]
  /** Butacas alquiladas por función (occurrenceId → butacas). */
  seatEvent: Record<string, number[]>
}

function union(a: number[], b: number[]): number[] {
  const out = a.slice()
  ;(b || []).forEach((n) => { if (out.indexOf(n) < 0) out.push(n) })
  return out
}

/** Ocupación persistida del palco (modes.*.taken), sin tener en cuenta el carrito. */
export function palcoOccupancy(p: Palco): PalcoOccupancy {
  return {
    palcoYear: !!p.modes.palcoYear.taken,
    seatYear: (p.modes.seatYear.taken || []).slice(),
    seatEvent: p.modes.seatEvent.taken || {},
  }
}

/**
 * Suma a `occ` lo que el CARRITO ya tiene reservado para este palco, de modo que
 * dos líneas del mismo carrito no puedan pisarse entre sí. `items` son las líneas
 * del carrito (de cualquier palco); sólo cuentan las de `palcoId`.
 */
export function withCart(occ: PalcoOccupancy, items: OrderItem[], palcoId: string): PalcoOccupancy {
  const next: PalcoOccupancy = {
    palcoYear: occ.palcoYear,
    seatYear: occ.seatYear.slice(),
    seatEvent: { ...occ.seatEvent },
  }
  ;(items || []).filter((it) => it.palcoId === palcoId).forEach((it) => {
    if (it.mode === 'palcoYear') next.palcoYear = true
    else if (it.mode === 'seatYear') next.seatYear = union(next.seatYear, it.seats)
    else if (it.mode === 'seatEvent' && it.occurrenceId) {
      next.seatEvent[it.occurrenceId] = union(next.seatEvent[it.occurrenceId] || [], it.seats)
    }
  })
  return next
}

/** ¿La butaca está tomada por TODA la temporada? (palco entero anual, o butaca
 *  anual). Si lo está, no puede reservarse ni anual ni para ninguna función. */
function seatHeldAllSeason(occ: PalcoOccupancy, seat: number): boolean {
  return occ.palcoYear || occ.seatYear.indexOf(seat) >= 0
}

/** ¿La butaca está tomada en ALGUNA función de la temporada? */
function seatHeldAnyEvent(occ: PalcoOccupancy, seat: number): boolean {
  return Object.keys(occ.seatEvent).some((k) => (occ.seatEvent[k] || []).indexOf(seat) >= 0)
}

/** ¿Hay alguna butaca reservada para algún evento de la temporada? */
function anyEventSeatTaken(occ: PalcoOccupancy): boolean {
  return Object.keys(occ.seatEvent).some((k) => (occ.seatEvent[k] || []).length > 0)
}

/**
 * ¿Se puede reservar la butaca por el AÑO (temporada completa)?
 * No, si el palco entero ya está alquilado por el año (RN-1), si la butaca ya es
 * anual, o si está tomada para CUALQUIER función de la temporada (RN-3): tener la
 * butaca todo el año choca con tenerla en cualquiera de esas funciones.
 */
export function seatYearAvailable(occ: PalcoOccupancy, seat: number): boolean {
  return !seatHeldAllSeason(occ, seat) && !seatHeldAnyEvent(occ, seat)
}

/**
 * ¿Se puede reservar la butaca para una FUNCIÓN puntual?
 * No, si el palco entero está alquilado por el año (RN-1), si la butaca es anual
 * (RN-1/RN-3), o si ya está tomada para ESA función.
 */
export function seatEventAvailable(occ: PalcoOccupancy, seat: number, occurrenceId: string | null | undefined): boolean {
  if (seatHeldAllSeason(occ, seat)) return false
  if (!occurrenceId) return false
  return (occ.seatEvent[occurrenceId] || []).indexOf(seat) < 0
}

/**
 * ¿Se puede alquilar el palco ENTERO por el año?
 * No, si ya está alquilado por el año, o si hay CUALQUIER butaca reservada —
 * anual o por evento (RN-2): el palco entero exige todas las butacas libres en
 * toda la temporada.
 */
export function palcoYearAvailable(occ: PalcoOccupancy): boolean {
  return !occ.palcoYear && occ.seatYear.length === 0 && !anyEventSeatTaken(occ)
}

/** ¿Queda alguna butaca reservable por el año? */
export function seatYearHasFree(p: Palco, occ: PalcoOccupancy): boolean {
  for (let s = 1; s <= p.seats; s++) if (seatYearAvailable(occ, s)) return true
  return false
}

/** ¿Queda alguna butaca reservable para algún evento? (depende sólo de las
 *  butacas tomadas por toda la temporada, no de una función concreta). */
export function seatEventHasFree(p: Palco, occ: PalcoOccupancy): boolean {
  for (let s = 1; s <= p.seats; s++) if (!seatHeldAllSeason(occ, s)) return true
  return false
}

/** Butacas libres para una función puntual (descuenta también lo anual). */
export function freeSeatsForEvent(p: Palco, occ: PalcoOccupancy, occurrenceId: string | null | undefined): number {
  if (!occurrenceId) return 0
  let n = 0
  for (let s = 1; s <= p.seats; s++) if (seatEventAvailable(occ, s, occurrenceId)) n++
  return n
}
