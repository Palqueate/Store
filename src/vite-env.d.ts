/// <reference types="vite/client" />

// Variables de entorno de la app (prefijo VITE_ para exponerlas al cliente).
// Definí los valores en un archivo .env (ver .env.example).
interface ImportMetaEnv {
  /** Origen de datos: 'memory' (in-memory, por defecto) o 'http' (API real). */
  readonly VITE_DATA_SOURCE?: 'memory' | 'http'
  /** Base URL de la API cuando VITE_DATA_SOURCE='http'. Ej: '/api' o 'https://api.palqueate.uy/v1'. */
  readonly VITE_API_BASE_URL?: string
  /** Timeout de las requests HTTP en milisegundos (por defecto 15000). */
  readonly VITE_API_TIMEOUT_MS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
