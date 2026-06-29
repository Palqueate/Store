export interface Stadium {
  id: string
  name: string
  short: string
  city: string
  /** País donde se ubica el estadio. */
  country?: string
  shape: string
  capacity?: number
  year?: number | null
  surface?: string
  levels?: number
  address?: string
  roof?: boolean
  /** Optional real plan/photo of the stadium (data URL). When set, the map
   *  renders it as the background instead of the stylized pitch. */
  mapImage?: string
}
