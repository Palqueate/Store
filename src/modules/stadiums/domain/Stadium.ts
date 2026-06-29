export interface Stadium {
  id: string
  name: string
  short: string
  city: string
  shape: string
  capacity?: number
  year?: number | null
  surface?: string
  levels?: number
  address?: string
  roof?: boolean
}
