// @ts-nocheck
// Route table + navigation bridge. The URL is the source of truth for which
// screen renders; the store keeps a mirrored `screen` value (set by
// RouterBridge) only so the view-model layer's active-state logic keeps working.
// Store actions navigate through routerNavigate() (a module ref bound by
// RouterBridge), since Zustand actions live outside React and can't use hooks.

// screen name -> URL path (params resolved at navigation time from state)
const SCREEN_PATHS = {
  home: '/',
  results: '/palcos',
  events: '/eventos',
  eventPalcos: '/evento/:eventId',
  detail: '/palco/:palcoId',
  cart: '/carrito',
  checkout: '/checkout',
  confirm: '/confirmacion',
  food: '/comida',
  foodConfirm: '/comida/confirmacion',
  owner: '/owner',
  metrics: '/owner/metricas',
  publish: '/publicar',
  account: '/cuenta',
  admin: '/admin',
}

// Build a concrete path for a screen, filling params from current state.
export function pathForScreen(screen, state) {
  if (screen === 'detail') return '/palco/' + (state && state.pId ? state.pId : '')
  if (screen === 'eventPalcos') return '/evento/' + (state && state.eventId ? state.eventId : '')
  return SCREEN_PATHS[screen] || '/'
}

const STATIC_SCREEN_BY_PATH = {
  '/palcos': 'results',
  '/eventos': 'events',
  '/carrito': 'cart',
  '/checkout': 'checkout',
  '/confirmacion': 'confirm',
  '/comida': 'food',
  '/comida/confirmacion': 'foodConfirm',
  '/owner': 'owner',
  '/owner/metricas': 'metrics',
  '/publicar': 'publish',
  '/cuenta': 'account',
  '/admin': 'admin',
}

// Resolve a pathname to a screen (+ any route params).
export function screenForPath(pathname) {
  const path = (pathname || '/').replace(/\/+$/, '') || '/'
  if (path === '/') return { screen: 'home' }
  const palco = path.match(/^\/palco\/(.+)$/)
  if (palco) return { screen: 'detail', palcoId: decodeURIComponent(palco[1]) }
  const evento = path.match(/^\/evento\/(.+)$/)
  if (evento) return { screen: 'eventPalcos', eventId: decodeURIComponent(evento[1]) }
  return { screen: STATIC_SCREEN_BY_PATH[path] || 'home' }
}

// ---- navigate ref, bound by RouterBridge ----
let _navigate = null
export function bindNavigate(fn) { _navigate = fn }
export function routerNavigate(path) { if (_navigate) _navigate(path) }
