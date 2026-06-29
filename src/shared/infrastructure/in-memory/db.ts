// ============================================================
// PALQUEATE · in-memory database
// The canonical seed collections, ported verbatim from the prototype.
// They are MUTABLE on purpose: the in-memory repository adapters push new
// events/stadiums/palcos into these arrays in place, so changes propagate
// across the client exactly like the original. The day a real backend
// exists, the HTTP adapters replace these reads/writes — this module is
// the single source of truth that the in-memory adapters wrap.
// ============================================================
import type { Stadium } from '../../../modules/stadiums/domain/Stadium'
import type { Ev, EventType } from '../../../modules/events/domain/Event'
import type { Palco } from '../../../modules/palcos/domain/Palco'
import type { FoodItem, FoodCat } from '../../../modules/food/domain/Food'
import type { User } from '../../../modules/accounts/domain/User'
import type { Order } from '../../../modules/orders/domain/Order'

export const STADIUMS: Record<string, Stadium> = {
  gpc: { id: 'gpc', name: 'Gran Parque Central', short: 'GPC', city: 'Montevideo', country: 'Uruguay', shape: 'rect', capacity: 34000, year: 1900, surface: 'Césped natural', levels: 2, address: 'Carlos Anaya 2900', roof: false },
  cds: { id: 'cds', name: 'Campeón del Siglo', short: 'CDS', city: 'Montevideo', country: 'Uruguay', shape: 'bowl', capacity: 40000, year: 2016, surface: 'Césped natural', levels: 3, address: 'Cno. Maldonado 4000', roof: false },
}

export const EVENTS: Ev[] = [
  { id: 'e1', stadium: 'gpc', country: 'Uruguay', comp: 'Torneo Apertura', round: 'Fecha 7', opp: 'Costa FC', month: 'JUL', day: '12', dow: 'SÁB', time: '17:00', tag: 'Local', label: 'Torneo Apertura · Fecha 7' },
  { id: 'e2', stadium: 'gpc', country: 'Uruguay', comp: 'Copa Nacional', round: 'Octavos · vuelta', opp: 'Atlético Litoral', month: 'JUL', day: '26', dow: 'SÁB', time: '20:15', tag: 'Copa', label: 'Copa Nacional · Octavos' },
  { id: 'e3', stadium: 'gpc', country: 'Uruguay', comp: 'Torneo Apertura', round: 'Fecha 11', opp: 'Club Aurora', month: 'AGO', day: '09', dow: 'SÁB', time: '17:30', tag: 'Destacado', label: 'Torneo Apertura · Fecha 11' },
  { id: 'e4', stadium: 'cds', country: 'Uruguay', comp: 'Torneo Apertura', round: 'Fecha 8', opp: 'Deportivo Pradera', month: 'JUL', day: '19', dow: 'SÁB', time: '16:00', tag: 'Local', label: 'Torneo Apertura · Fecha 8' },
  { id: 'e5', stadium: 'cds', country: 'Uruguay', comp: 'Copa Libertadores', round: 'Fase de grupos', opp: 'Estuario FC', month: 'JUL', day: '30', dow: 'MIÉ', time: '21:30', tag: 'Copa', label: 'Copa Libertadores · Grupo' },
  // Show con varias funciones: el cliente elige fecha y hora antes de ver palcos.
  { id: 'e6', stadium: 'gpc', country: 'Uruguay', type: 'show', comp: 'Gira Mundial', round: '', opp: 'Banda Aurora', month: 'AGO', day: '22', dow: 'VIE', time: '21:00', tag: 'Destacado', label: 'Gira Mundial',
    dates: [
      { id: 'e6-1', month: 'AGO', day: '22', dow: 'VIE', time: '21:00' },
      { id: 'e6-2', month: 'AGO', day: '23', dow: 'SÁB', time: '21:00' },
      { id: 'e6-3', month: 'AGO', day: '24', dow: 'DOM', time: '19:00' },
    ] },
]

export const EVENT_TYPES: EventType[] = [
  { id: 'futbol', name: 'Fútbol', tag: 'Local' },
  { id: 'basketball', name: 'Basketball', tag: 'Local' },
  { id: 'show', name: 'Show', tag: 'Destacado' },
]

export const PALCOS: Palco[] = [
  { id: 'p1', stadium: 'gpc', title: 'Palco Atilio García', sector: 'Tribuna Atilio García · Nivel Palcos', map: { x: 50, y: 13.5 }, seats: 10, parking: { has: true, n: 2 }, host: 'Familia Méndez', rating: 4.9, photos: 3, images: [],
    modes: { palcoYear: { on: true, price: 1180000 }, seatYear: { on: true, price: 96000, taken: [3, 4] }, seatEvent: { on: true, price: 6500, taken: { e1: [1, 2], e2: [], e3: [1, 2, 3, 4, 5], 'e6-1': [1, 2, 3], 'e6-2': [], 'e6-3': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } } }, status: 'publicado' },
  { id: 'p2', stadium: 'cds', title: 'Palco Henderson', sector: 'Tribuna Henderson · Platea Alta', map: { x: 50, y: 12 }, seats: 12, parking: { has: true, n: 3 }, host: 'Grupo Aurinegro SA', rating: 4.8, photos: 4, images: [],
    modes: { palcoYear: { on: true, price: 1450000 }, seatYear: { on: true, price: 108000, taken: [7, 8, 9] }, seatEvent: { on: true, price: 7200, taken: { e4: [1], e5: [1, 2, 3], e6: [] } } }, status: 'publicado' },
  { id: 'p3', stadium: 'gpc', title: 'Palco Esquina Norte', sector: 'Codo Norte · Nivel Palcos', map: { x: 78, y: 24 }, seats: 8, parking: { has: false, n: 0 }, host: 'Vos (demo)', rating: 4.7, photos: 2, images: [],
    modes: { palcoYear: { on: false, price: 980000 }, seatYear: { on: true, price: 84000, taken: [1, 2, 5] }, seatEvent: { on: true, price: 5400, taken: { e1: [3, 4], e2: [3, 4, 5], e3: [6], 'e6-1': [1], 'e6-2': [3, 4, 5], 'e6-3': [6] } } }, status: 'publicado' },
  { id: 'p4', stadium: 'cds', title: 'Palco Olímpico', sector: 'Tribuna Olímpica · Platea Alta', map: { x: 24, y: 30 }, seats: 10, parking: { has: true, n: 2 }, host: 'Inversiones del Sur', rating: 4.6, photos: 3, images: [],
    modes: { palcoYear: { on: true, price: 1290000 }, seatYear: { on: false, price: 99000, taken: [] }, seatEvent: { on: true, price: 6800, taken: { e4: [5, 6], e5: [], e6: [1, 2] } } }, status: 'publicado' },
  { id: 'p5', stadium: 'gpc', title: 'Palco Abdón Porte', sector: 'Tribuna Abdón Porte · Centro', map: { x: 50, y: 86.5 }, seats: 14, parking: { has: true, n: 4 }, host: 'Estudio Caraballo', rating: 5.0, photos: 5, images: [],
    modes: { palcoYear: { on: true, price: 1620000 }, seatYear: { on: true, price: 118000, taken: [2] }, seatEvent: { on: true, price: 8200, taken: { e1: [1, 2, 3], e2: [], e3: [], 'e6-1': [1, 2], 'e6-2': [], 'e6-3': [1, 2, 3] } } }, status: 'publicado' },
  { id: 'p6', stadium: 'cds', title: 'Palco Palacio', sector: 'Codo Sur · Nivel Palcos', map: { x: 74, y: 74 }, seats: 8, parking: { has: true, n: 1 }, host: 'Vos (demo)', rating: 4.5, photos: 2, images: [],
    modes: { palcoYear: { on: true, price: 1040000 }, seatYear: { on: true, price: 88000, taken: [3, 4, 5, 6] }, seatEvent: { on: true, price: 5900, taken: { e4: [1, 2], e5: [7, 8], e6: [2] } } }, status: 'pausado' },
]

export const FOOD: FoodItem[] = [
  { id: 'f1', cat: 'compartir', name: 'Nachos con cheddar', price: 590, desc: 'Cheddar fundido y jalapeños' },
  { id: 'f2', cat: 'compartir', name: 'Picada del palco', price: 1290, desc: 'Quesos, fiambres y aceitunas' },
  { id: 'f3', cat: 'compartir', name: 'Papas bravas', price: 480, desc: 'Con alioli y picante' },
  { id: 'f4', cat: 'sandwich', name: 'Chivito al pan', price: 790, desc: 'Lomo, panceta, huevo y queso' },
  { id: 'f5', cat: 'sandwich', name: 'Choripán', price: 420, desc: 'Con chimichurri casero' },
  { id: 'f6', cat: 'sandwich', name: 'Pancho completo', price: 340, desc: 'Doble salchicha' },
  { id: 'f7', cat: 'pizza', name: 'Pizza muzzarella', price: 680, desc: '8 porciones' },
  { id: 'f8', cat: 'pizza', name: 'Fainá', price: 220, desc: 'Recién horneada' },
  { id: 'f9', cat: 'cerveza', name: 'Cerveza tirada 1L', price: 520, desc: 'Rubia bien fría' },
  { id: 'f10', cat: 'cerveza', name: 'Six pack lata', price: 840, desc: '6 x 473ml' },
  { id: 'f11', cat: 'bebida', name: 'Refresco 1.5L', price: 280, desc: 'Cola / lima / naranja' },
  { id: 'f12', cat: 'bebida', name: 'Agua mineral', price: 140, desc: 'Con o sin gas' },
  { id: 'f13', cat: 'dulce', name: 'Alfajores x3', price: 260, desc: 'De maicena o chocolate' },
  { id: 'f14', cat: 'dulce', name: 'Pop corn dulce', price: 230, desc: 'Balde grande' },
]

export const FOOD_CATS: FoodCat[] = [
  { id: 'all', name: 'Todo' }, { id: 'compartir', name: 'Para compartir' }, { id: 'sandwich', name: 'Sándwiches' },
  { id: 'pizza', name: 'Pizzas' }, { id: 'cerveza', name: 'Cervezas' }, { id: 'bebida', name: 'Bebidas' }, { id: 'dulce', name: 'Dulce' },
]

// Cuenta demo
export const SEED_USER: User = {
  id: 'u_maru', name: 'María Eugenia', email: 'maria.eugenia@palqueate.uy', phone: '099 555 123', pass: 'palqueate', joined: '2025-03-12T00:00:00.000Z',
  ci: '4.812.345-6', birth: '1989-07-14', city: 'Montevideo', address: 'Bvar. España 2456, Apto 701', country: 'Uruguay',
  favStadium: 'gpc', lang: 'Español (UY)', verified: true, points: 1840, admin: true,
  notif: { email: true, sms: false, push: true, promos: true },
  card: { brand: 'Visa', last4: '4242', exp: '08/27', name: 'María Eugenia Fernández' },
  billing: { name: 'María Eugenia Fernández', rut: '' },
}

export const SEED_ORDERS: Order[] = [
  { code: 'PLQ-ME02', userId: 'u_maru', subtotal: 108000, fee: 4320, total: 112320, date: '2026-05-22T19:30:00.000Z', contact: { name: 'María Eugenia', email: 'maria.eugenia@palqueate.uy' }, food: [], foodTotal: 0,
    items: [{ uid: 'me2a', palcoId: 'p2', palcoTitle: 'Palco Henderson', stadium: 'cds', mode: 'seatYear', modeLabel: 'Asiento anual · 1 año', seats: [4], term: 'Temporada 2026 · 1 año', qty: 1, price: 108000 }] },
  { code: 'PLQ-ME01', userId: 'u_maru', subtotal: 13000, fee: 520, total: 13520, date: '2026-06-10T17:00:00.000Z', contact: { name: 'María Eugenia', email: 'maria.eugenia@palqueate.uy' }, foodTotal: 2620,
    food: [{ id: 'f4', name: 'Chivito al pan', qty: 2, price: 790 }, { id: 'f9', name: 'Cerveza tirada 1L', qty: 2, price: 520 }],
    items: [{ uid: 'me1a', palcoId: 'p1', palcoTitle: 'Palco Atilio García', stadium: 'gpc', mode: 'seatEvent', modeLabel: 'Asiento · por evento', seats: [5, 6], eventId: 'e1', occurrenceId: 'e1', eventLabel: 'Torneo Apertura · Fecha 7', eventOpp: 'Costa FC', term: '12 JUL · 17:00 hs', qty: 2, price: 13000 }] },
]
