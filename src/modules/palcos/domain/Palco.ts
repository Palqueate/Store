export interface PalcoModes {
  palcoYear: { on: boolean; price: number }
  seatYear: { on: boolean; price: number; taken: number[] }
  seatEvent: { on: boolean; price: number; taken: Record<string, number[]> }
}

export type PalcoStatus = 'publicado' | 'pausado' | 'alquilado'

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
  parking: { has: boolean; n: number }
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
}
