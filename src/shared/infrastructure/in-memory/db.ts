// ============================================================
// PALQUEATE · in-memory database
// The canonical seed collections, ported verbatim from the prototype.
// They are MUTABLE on purpose: the in-memory repository adapters push new
// events/stadiums/palcos into these arrays in place, so changes propagate
// across the client exactly like the original. The day a real backend
// exists, the HTTP adapters replace these reads/writes — this module is
// the single source of truth that the in-memory adapters wrap.
//
// La única modalidad de reserva es "asiento por evento" (las anuales se
// removieron del producto; ver PalcoModes). Los datos incluyen:
//  · seatEvent.taken → butacas ocupadas por función, coherentes con las compras
//    sembradas (SEED_ORDERS).
//  · Órdenes con evento pasado (botana no disponible) y futuro (sí disponible).
// ============================================================
import type { Stadium } from '../../../modules/stadiums/domain/Stadium'
import type { Ev, EventType } from '../../../modules/events/domain/Event'
import type { Palco } from '../../../modules/palcos/domain/Palco'
import type { FoodItem, FoodCat } from '../../../modules/food/domain/Food'
import type { User } from '../../../modules/accounts/domain/User'
import type { Order } from '../../../modules/orders/domain/Order'
import { promoPoster } from '../../lib/promoPosters'

export const STADIUMS: Record<string, Stadium> = {
  cen: { id: 'cen', name: 'Estadio Centenario', short: 'CEN', city: 'Montevideo', country: 'Uruguay', shape: 'bowl', capacity: 60000, year: 1930, surface: 'Césped natural', levels: 3, address: 'Av. Dr. Américo Ricaldoni s/n', roof: false },
  franzini: { id: 'franzini', name: 'Estadio Luis Franzini', short: 'FRA', city: 'Montevideo', country: 'Uruguay', shape: 'rect', capacity: 18000, year: 1961, surface: 'Césped natural', levels: 1, address: 'Bulevar Artigas 1442', roof: false },
  saroldi: { id: 'saroldi', name: 'Estadio Parque Saroldi', short: 'SAR', city: 'Montevideo', country: 'Uruguay', shape: 'rect', capacity: 12000, year: 1936, surface: 'Césped natural', levels: 2, address: 'Cno. Edison 3400', roof: false },
}

// Los eventos de muestra se construyen con `buildEvent`, que replica la forma
// EXACTA que produce el alta de eventos del admin (adminCreateEvent): cada
// evento lleva su lista de funciones `dates` (fecha + hora con `iso`), incluso
// los de fecha única, y los campos principales month/day/dow/iso/time se
// DERIVAN de la primera función (no se escriben a mano). Así los datos sembrados
// quedan siempre consistentes con los que se cargan al crear o editar un evento.
const EV_MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
const EV_DOWS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

/** Deriva month/day/dow/iso de una fecha ISO (mismo criterio que admin._fmtDate). */
function evOcc(iso: string, time: string): { month: string; day: string; dow: string; time: string; iso: string } {
  const d = new Date(iso + 'T00:00:00')
  return { month: EV_MONTHS[d.getMonth()], day: String(d.getDate()).padStart(2, '0'), dow: EV_DOWS[d.getDay()], time, iso }
}

interface SeedEvent {
  id: string
  stadium: string
  country?: string
  type?: string
  comp: string
  round: string
  opp: string
  tag: string
  /** Funciones del evento como [fecha ISO, hora]. Una para fútbol, varias para shows. */
  functions: Array<{ iso: string; time: string }>
  images?: string[]
  obs?: string
}

/** Arma un Ev completo a partir del seed, igual que adminCreateEvent. */
function buildEvent(s: SeedEvent): Ev {
  const occ = s.functions.map((f, i) => ({
    id: s.functions.length === 1 ? s.id : s.id + '-' + (i + 1),
    ...evOcc(f.iso, f.time),
  }))
  const first = occ[0]
  return {
    id: s.id, stadium: s.stadium, country: s.country || 'Uruguay', type: s.type || 'futbol',
    comp: s.comp, round: s.round, opp: s.opp,
    month: first.month, day: first.day, dow: first.dow, iso: first.iso, time: first.time,
    dates: occ, tag: s.tag, label: s.comp + (s.round ? ' · ' + s.round : ''),
    images: s.images || [], obs: s.obs || '',
  }
}

// Hoy es 2026-06-30 en el entorno de la demo. e4 es una fecha YA PASADA (para
// demostrar que a una compra de un evento vencido no se le puede sumar botana);
// el resto son funciones por venir.
export const EVENTS: Ev[] = [
  buildEvent({ id: 'e1', stadium: 'cen', type: 'futbol', comp: 'Torneo Clausura', round: 'Fecha 3', opp: 'Racing', tag: 'Local',
    functions: [{ iso: '2026-07-05', time: '16:00' }] }),
  buildEvent({ id: 'e2', stadium: 'cen', type: 'futbol', comp: 'Copa Libertadores', round: 'Cuartos · ida', opp: 'Palmeiras', tag: 'Copa',
    functions: [{ iso: '2026-07-22', time: '19:30' }], obs: 'Partido internacional: el ingreso al estadio cierra 30 minutos antes del inicio.',
    images: [promoPoster({ title: 'Palmeiras', from: '#0C2A22', to: '#08130F', accent: '#34D17E' })] }),
  buildEvent({ id: 'e3', stadium: 'franzini', type: 'futbol', comp: 'Torneo Clausura', round: 'Fecha 4', opp: 'Danubio', tag: 'Local',
    functions: [{ iso: '2026-07-12', time: '15:00' }] }),
  // Evento YA JUGADO (24 de mayo): base de la compra PLQ-VR01, que no admite botana.
  buildEvent({ id: 'e4', stadium: 'saroldi', type: 'futbol', comp: 'Torneo Clausura', round: 'Fecha 2', opp: 'Cerro', tag: 'Local',
    functions: [{ iso: '2026-05-24', time: '15:30' }] }),
  // Show con dos funciones: el cliente elige fecha y hora antes de ver palcos.
  buildEvent({ id: 'e5', stadium: 'cen', type: 'show', comp: 'Noche de Estadio', round: '', opp: 'La Vela Puerca', tag: 'Destacado',
    functions: [{ iso: '2026-08-15', time: '21:00' }, { iso: '2026-08-16', time: '21:00' }],
    images: [promoPoster({ title: 'La Vela Puerca', from: '#2A1530', to: '#120A18', accent: '#E0A6FF' })] }),
  buildEvent({ id: 'e6', stadium: 'franzini', type: 'futbol', comp: 'Copa AUF Uruguay', round: 'Octavos', opp: 'Wanderers', tag: 'Copa',
    functions: [{ iso: '2026-08-02', time: '20:00' }],
    images: [promoPoster({ title: 'Wanderers', from: '#10243A', to: '#0B1622', accent: '#C9A24B' })] }),
  buildEvent({ id: 'e7', stadium: 'saroldi', type: 'show', comp: 'Gira Aniversario', round: '', opp: 'Jaime Roos', tag: 'Destacado',
    functions: [{ iso: '2026-09-05', time: '21:00' }], obs: 'Apertura de puertas 19:00.',
    images: [promoPoster({ title: 'Jaime Roos', from: '#3A1438', to: '#160A1E', accent: '#FF8CC8' })] }),
]

export const EVENT_TYPES: EventType[] = [
  { id: 'futbol', name: 'Fútbol', tag: 'Local' },
  { id: 'basketball', name: 'Basketball', tag: 'Local' },
  { id: 'show', name: 'Show', tag: 'Destacado' },
]

export const PALCOS: Palco[] = [
  { id: 'p1', stadium: 'cen', title: 'Palco Olímpico Norte', sector: 'Tribuna Olímpica · Nivel Palcos', map: { x: 50, y: 13.5 }, seats: 10, parking: { has: true, n: 2, price: 82000 }, host: 'Familia Sosa', rating: 4.8, photos: 3, images: [], amenities: ['Wi-Fi', 'Heladera', 'Televisión', 'Baño'],
    modes: { seatEvent: { on: true, price: 6800, taken: { e1: [1, 3], e2: [4], 'e5-1': [1, 2, 3, 4], 'e5-2': [] } } }, status: 'publicado' },
  { id: 'p2', stadium: 'cen', title: 'Palco Presidencial', sector: 'Tribuna América · Platea Preferencial', map: { x: 50, y: 86.5 }, seats: 12, parking: { has: true, n: 3, price: 90000 }, host: 'Grupo Aurora SA', rating: 4.9, photos: 4, images: [], amenities: ['Wi-Fi', 'Cocina', 'Bar', 'Aire acondicionado', 'Baño'],
    modes: { seatEvent: { on: true, price: 8500, taken: { e1: [5, 6, 7], e2: [1, 2], 'e5-1': [3, 4], 'e5-2': [1] } } }, status: 'publicado' },
  { id: 'p3', stadium: 'franzini', title: 'Palco Bulevar', sector: 'Tribuna Bulevar · Nivel Palcos', map: { x: 76, y: 26 }, seats: 8, parking: { has: false, n: 0, price: 0 }, host: 'Vos (demo)', rating: 4.6, photos: 2, images: [], amenities: ['Wi-Fi', 'Televisión'],
    modes: { seatEvent: { on: true, price: 5200, taken: { e3: [2, 3], e6: [1] } } }, status: 'publicado' },
  { id: 'p4', stadium: 'saroldi', title: 'Palco Río', sector: 'Tribuna Río · Platea Alta', map: { x: 26, y: 30 }, seats: 10, parking: { has: true, n: 2, price: 80000 }, host: 'Inversiones del Este', rating: 4.5, photos: 3, images: [], amenities: ['Wi-Fi', 'Parrillero', 'Baño'],
    modes: { seatEvent: { on: true, price: 6000, taken: { e4: [1, 2, 3, 4, 5], e7: [] } } }, status: 'publicado' },
  { id: 'p5', stadium: 'cen', title: 'Palco Cebra', sector: 'Tribuna Ámsterdam · Centro', map: { x: 82, y: 50 }, seats: 14, parking: { has: true, n: 4, price: 95000 }, host: 'Estudio Caraballo', rating: 5.0, photos: 5, images: [], amenities: ['Wi-Fi', 'Cocina', 'Heladera', 'Televisión', 'Calefacción', 'Bar'],
    modes: { seatEvent: { on: true, price: 7500, taken: { e1: [2, 4], e2: [1, 2, 3], 'e5-1': [1, 2], 'e5-2': [] } } }, status: 'publicado' },
  { id: 'p6', stadium: 'franzini', title: 'Palco Estudio', sector: 'Codo Sur · Nivel Palcos', map: { x: 24, y: 74 }, seats: 8, parking: { has: true, n: 1, price: 68000 }, host: 'Vos (demo)', rating: 4.4, photos: 2, images: [], amenities: ['Wi-Fi', 'Heladera'],
    modes: { seatEvent: { on: true, price: 5400, taken: { e3: [1], e6: [2, 3] } } }, status: 'pausado' },
]

export const FOOD: FoodItem[] = [
  { id: 'f1', cat: 'compartir', name: 'Tabla de fiambres', price: 1350, desc: 'Quesos, jamón crudo y aceitunas' },
  { id: 'f2', cat: 'compartir', name: 'Nachos supremos', price: 620, desc: 'Cheddar, guacamole y pico de gallo' },
  { id: 'f3', cat: 'compartir', name: 'Rabas a la provenzal', price: 890, desc: 'Con alioli de limón' },
  { id: 'f4', cat: 'sandwich', name: 'Chivito canario', price: 850, desc: 'Lomo, panceta, huevo y queso' },
  { id: 'f5', cat: 'sandwich', name: 'Milanesa al pan', price: 640, desc: 'Con lechuga, tomate y mayonesa' },
  { id: 'f6', cat: 'sandwich', name: 'Choripán artesanal', price: 450, desc: 'Con chimichurri casero' },
  { id: 'f7', cat: 'pizza', name: 'Pizza muzzarella', price: 720, desc: '8 porciones' },
  { id: 'f8', cat: 'pizza', name: 'Fugazzeta rellena', price: 780, desc: 'Cebolla y muzzarella' },
  { id: 'f9', cat: 'cerveza', name: 'Pinta artesanal IPA', price: 380, desc: 'Tirada, bien fría' },
  { id: 'f10', cat: 'cerveza', name: 'Balde x6 lager', price: 1650, desc: '6 x 355ml en hielo' },
  { id: 'f11', cat: 'bebida', name: 'Refresco 1.5L', price: 300, desc: 'Cola / lima / naranja' },
  { id: 'f12', cat: 'bebida', name: 'Agua mineral 600ml', price: 150, desc: 'Con o sin gas' },
  { id: 'f13', cat: 'dulce', name: 'Churros con dulce de leche', price: 340, desc: 'Media docena' },
  { id: 'f14', cat: 'dulce', name: 'Helado artesanal', price: 290, desc: 'Dulce de leche o chocolate' },
]

export const FOOD_CATS: FoodCat[] = [
  { id: 'all', name: 'Todo' }, { id: 'compartir', name: 'Para compartir' }, { id: 'sandwich', name: 'Sándwiches' },
  { id: 'pizza', name: 'Pizzas' }, { id: 'cerveza', name: 'Cervezas' }, { id: 'bebida', name: 'Bebidas' }, { id: 'dulce', name: 'Dulce' },
]

// Cuenta demo (el inicio de sesión de la demo entra a esta cuenta).
export const SEED_USER: User = {
  id: 'u_valen', name: 'Valentina Rivas', email: 'valentina.rivas@palqueate.uy', phone: '099 762 418', pass: 'palqueate', joined: '2025-02-08T00:00:00.000Z',
  ci: '5.204.771-3', birth: '1991-11-02', city: 'Montevideo', address: 'Av. Brasil 2765, Apto 402', country: 'Uruguay',
  favStadium: 'cen', lang: 'Español (UY)', verified: true, points: 2140, admin: true,
  notif: { email: true, sms: false, push: true, promos: true },
  card: { brand: 'Visa', last4: '7731', exp: '05/28', name: 'Valentina Rivas Long' },
  billing: { name: 'Valentina Rivas Long', rut: '' },
}

// Compras sembradas del usuario demo. Todas por evento (única modalidad), y
// cubren los dos casos de botana: evento pasado (no admite) y futuro (admite).
// Las butacas coinciden con los `taken` de cada palco.
export const SEED_ORDERS: Order[] = [
  // Asiento por un evento YA JUGADO (24 MAY) — NO admite sumar botana.
  { code: 'PLQ-VR01', userId: 'u_valen', subtotal: 12000, fee: 480, total: 12480, date: '2026-05-10T18:00:00.000Z', contact: { name: 'Valentina Rivas', email: 'valentina.rivas@palqueate.uy' }, food: [], foodTotal: 0,
    items: [{ uid: 'vr1a', palcoId: 'p4', palcoTitle: 'Palco Río', stadium: 'saroldi', mode: 'seatEvent', modeLabel: 'Asiento · por evento', seats: [1, 2], eventId: 'e4', occurrenceId: 'e4', eventLabel: 'Torneo Clausura · Fecha 2', eventOpp: 'Cerro', term: '24 MAY · 15:30 hs', qty: 2, price: 12000 }] },
  // Asiento por un evento POR VENIR (05 JUL), ya con algo de botana — admite sumar más.
  { code: 'PLQ-VR02', userId: 'u_valen', subtotal: 6800, fee: 272, total: 7072, date: '2026-06-20T16:30:00.000Z', contact: { name: 'Valentina Rivas', email: 'valentina.rivas@palqueate.uy' }, foodTotal: 1610,
    food: [{ id: 'f4', name: 'Chivito canario', qty: 1, price: 850 }, { id: 'f9', name: 'Pinta artesanal IPA', qty: 2, price: 380 }],
    items: [{ uid: 'vr2a', palcoId: 'p1', palcoTitle: 'Palco Olímpico Norte', stadium: 'cen', mode: 'seatEvent', modeLabel: 'Asiento · por evento', seats: [3], eventId: 'e1', occurrenceId: 'e1', eventLabel: 'Torneo Clausura · Fecha 3', eventOpp: 'Racing', term: '05 JUL · 16:00 hs', qty: 1, price: 6800 }] },
]
