export interface PalcoModes {
  palcoYear: { on: boolean; price: number }
  seatYear: { on: boolean; price: number; taken: number[] }
  seatEvent: { on: boolean; price: number; taken: Record<string, number[]> }
}

export type PalcoStatus = 'publicado' | 'pausado' | 'alquilado'

export interface Palco {
  id: string
  stadium: string
  title: string
  sector: string
  map: { x: number; y: number }
  seats: number
  parking: { has: boolean; n: number }
  host: string
  rating: number
  photos: number
  images: string[]
  modes: PalcoModes
  status: PalcoStatus
}
