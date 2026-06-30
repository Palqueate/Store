export interface PalcoModes {
  palcoYear: { on: boolean; price: number }
  seatYear: { on: boolean; price: number; taken: number[] }
  seatEvent: { on: boolean; price: number; taken: Record<string, number[]> }
}

// 'pendiente'  → registrado, esperando verificación del admin
// 'rechazado'  → el admin lo rechazó; el palquista debe revisar los campos malos
// 'publicado'  → aprobado y disponible para alquilar
// 'pausado'    → el dueño lo pausó · 'alquilado' → con reservas activas
export type PalcoStatus = 'pendiente' | 'rechazado' | 'publicado' | 'pausado' | 'alquilado'

/** Un campo marcado por el admin como no validado, con su motivo y la
 *  eventual respuesta del palquista defendiendo o aclarando el dato. */
export interface PalcoFieldFlag {
  /** Clave del campo (ver PALCO_REVIEW_FIELDS). */
  key: string
  label: string
  /** Motivo por el que el admin lo marcó como incorrecto. */
  reason: string
  /** Respuesta del palquista: por qué el dato está bien, o aclaración. */
  ownerReply?: string
}

/** Resultado de la última revisión de un palco rechazado. */
export interface PalcoReview {
  /** Motivo general del rechazo. */
  reason: string
  /** Campos marcados como no validados. */
  fields: PalcoFieldFlag[]
  reviewedAt?: string
}

/** Catálogo de campos revisables por el admin durante la verificación.
 *  Cada uno puede marcarse como no validado con un motivo. */
export const PALCO_REVIEW_FIELDS: { key: string; label: string }[] = [
  { key: 'country', label: 'País' },
  { key: 'stadium', label: 'Estadio' },
  { key: 'map', label: 'Ubicación en el plano' },
  { key: 'seats', label: 'Cantidad de asientos' },
  { key: 'parking', label: 'Estacionamiento' },
  { key: 'amenities', label: 'Comodidades' },
  { key: 'images', label: 'Fotos del palco' },
  { key: 'coOwners', label: 'Co-propietarios' },
  { key: 'payout.country', label: 'País de la cuenta bancaria' },
  { key: 'payout.swift', label: 'SWIFT / BIC' },
  { key: 'payout.bank', label: 'Banco' },
  { key: 'payout.beneficiary', label: 'Beneficiario bancario' },
  { key: 'payout.accountNumber', label: 'Número de cuenta' },
  { key: 'payout.branch', label: 'Sucursal del banco' },
  { key: 'payout.idFront', label: 'Documento de identidad · anverso' },
  { key: 'payout.idBack', label: 'Documento de identidad · reverso' },
  { key: 'payout.proofOfAddress', label: 'Comprobante de domicilio' },
  { key: 'payout.propertyTitle', label: 'Título de propiedad del palco' },
]

/** Co-propietario del palco: nombre y email de contacto. */
export interface PalcoCoOwner {
  name: string
  email: string
}

/** Datos de la cuenta de cobro del palquista, incluidos los documentos
 *  (imágenes en data URL) que respaldan la titularidad y el domicilio. */
export interface PalcoPayout {
  /** País de la cuenta bancaria. */
  country: string
  /** Código SWIFT/BIC — opcional. */
  swift: string
  bank: string
  /** Nombre completo del beneficiario bancario. */
  beneficiary: string
  accountNumber: string
  /** Sucursal del banco. */
  branch: string
  /** Documento de identidad — anverso (data URL). */
  idFront: string
  /** Documento de identidad — reverso (data URL). */
  idBack: string
  /** Comprobante de domicilio de no más de 3 meses (data URL). */
  proofOfAddress: string
  /** Título de propiedad del palco (data URL). */
  propertyTitle: string
}

export interface Palco {
  id: string
  stadium: string
  /** País donde está el palco (se deriva del estadio elegido). */
  country?: string
  title: string
  sector: string
  map: { x: number; y: number }
  seats: number
  /** Estacionamiento: si incluye, cuántos lugares y el precio por lugar
   *  (mismo período que la reserva). `price` es 0 cuando no hay estacionamiento. */
  parking: { has: boolean; n: number; price: number }
  /** Comodidades del palco (Wi-Fi, Cocina, etc. + las que agregue el palquista). */
  amenities?: string[]
  /** Co-propietarios opcionales del palco. */
  coOwners?: PalcoCoOwner[]
  /** Datos de cobro y documentación del palquista. */
  payout?: PalcoPayout
  host: string
  rating: number
  photos: number
  images: string[]
  modes: PalcoModes
  status: PalcoStatus
  /** Última revisión del admin — presente cuando el palco fue rechazado. */
  review?: PalcoReview
}
