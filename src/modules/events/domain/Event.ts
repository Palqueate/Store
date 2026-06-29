/** A scheduled match/show at a stadium. Named `Ev` in the prototype. */
export interface Ev {
  id: string
  stadium: string
  /** País del evento. Por defecto coincide con el del estadio sede. */
  country?: string
  comp: string
  round: string
  opp: string
  month: string
  day: string
  dow: string
  time: string
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
