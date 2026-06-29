// Países disponibles para estadios y eventos. Uruguay primero por ser el
// mercado base; el resto en orden alfabético. Se usa como fuente única para
// los selectores del panel de administración.
export const COUNTRIES: string[] = [
  'Uruguay',
  'Argentina',
  'Bolivia',
  'Brasil',
  'Chile',
  'Colombia',
  'Ecuador',
  'España',
  'Estados Unidos',
  'México',
  'Paraguay',
  'Perú',
  'Venezuela',
]

/** País por defecto cuando no se indica otro. */
export const DEFAULT_COUNTRY = 'Uruguay'

/** Opciones listas para los componentes Select/Combobox. */
export const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({ value: c, label: c }))
