// Versión del seed en memoria. Los adaptadores in-memory persisten en
// localStorage y FUSIONAN lo guardado con el seed. Cuando el seed cambia de
// forma incompatible con lo que pudo quedar guardado (p. ej. se renombran los
// estadios y las compras viejas referencian ids que ya no existen), hay que
// descartar esas colecciones persistidas para que el nuevo seed mande y la app
// no rompa al leer datos colgados.
//
// Subí SEED_VERSION cada vez que regeneres los datos sembrados.
import { readString, writeString } from '../storage/localStorage'

export const SEED_VERSION = '2026-07-02'

const VERSION_KEY = 'pq_seed_version'
// Colecciones sembradas que se persisten y por lo tanto hay que limpiar al
// cambiar de versión. (Los palcos no se persisten; salen siempre del seed.)
const SEEDED_KEYS = ['pq_orders', 'pq_accounts', 'pq_session', 'pq_admin_stadiums', 'pq_admin_events']

/**
 * Si la versión guardada no coincide con la actual, borra las colecciones
 * sembradas persistidas y registra la nueva versión. Es idempotente y se ejecuta
 * una sola vez por cambio de seed, ANTES de construir los repositorios (para que
 * rehidraten en limpio). Silencioso ante SSR / almacenamiento no disponible.
 */
export function resetPersistenceOnSeedChange(): void {
  try {
    if (readString(VERSION_KEY) === SEED_VERSION) return
    for (const k of SEEDED_KEYS) writeString(k, null)
    writeString(VERSION_KEY, SEED_VERSION)
  } catch {
    /* localStorage no disponible: nada que limpiar */
  }
}
