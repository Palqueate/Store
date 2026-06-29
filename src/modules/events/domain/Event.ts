/** Una función puntual de un evento: una fecha + hora concreta. */
export interface EventOccurrence {
  /** Id único de la función. Para eventos de fecha única coincide con el id del evento. */
  id: string
  month: string
  day: string
  dow: string
  time: string
  iso?: string
}

/** A scheduled match/show at a stadium. Named `Ev` in the prototype. */
export interface Ev {
  id: string
  stadium: string
  /** País del evento. Por defecto coincide con el del estadio sede. */
  country?: string
  comp: string
  round: string
  opp: string
  /**
   * Fecha/hora "principal" del evento (la primera función). Se mantiene para
   * compatibilidad y para las tarjetas: un evento puede tener varias funciones
   * en `dates`. Cuando `dates` existe, estos campos reflejan la primera.
   */
  month: string
  day: string
  dow: string
  time: string
  /**
   * Funciones del evento (fecha + hora). Para fútbol suele haber una sola; para
   * shows y otros eventos puede haber varias. Si está vacío o ausente, se deriva
   * una única función a partir de los campos `month/day/dow/time/iso`.
   */
  dates?: EventOccurrence[]
  tag: string
  label: string
  type?: string
  iso?: string
  images?: string[]
  /** Observación opcional del evento (nota libre del administrador). */
  obs?: string
}

export interface EventType {
  id: string
  name: string
  tag: string
}

/**
 * Devuelve las funciones (fecha + hora) de un evento. Si el evento no define
 * `dates`, se construye una única función a partir de sus campos principales,
 * usando el id del evento como id de la función (compatibilidad hacia atrás:
 * la disponibilidad de asientos por evento queda indexada por ese mismo id).
 */
export function eventOccurrences(ev: Ev): EventOccurrence[] {
  if (ev && ev.dates && ev.dates.length) return ev.dates
  return [{ id: ev.id, month: ev.month, day: ev.day, dow: ev.dow, time: ev.time, iso: ev.iso }]
}

/** Busca una función concreta del evento por su id (o la primera por defecto). */
export function eventOccurrence(ev: Ev, occId?: string): EventOccurrence | undefined {
  const occs = eventOccurrences(ev)
  return occs.find((o) => o.id === occId) || occs[0]
}
