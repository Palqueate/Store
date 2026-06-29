/**
 * Format an amount as Uruguayan pesos. Pure domain helper — no UI, no I/O.
 * Mirrors the prototype's `money()` so output stays identical across the app.
 */
export function formatMoney(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return ''
  return '$U ' + Math.round(amount).toLocaleString('es-UY')
}
