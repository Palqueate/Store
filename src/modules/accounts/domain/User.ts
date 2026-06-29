export interface User {
  id: string
  name: string
  email: string
  phone?: string
  pass?: string
  joined?: string
  ci?: string
  birth?: string
  city?: string
  address?: string
  country?: string
  favStadium?: string
  lang?: string
  verified?: boolean
  points?: number
  admin?: boolean
  photo?: string | null
  notif?: { email?: boolean; sms?: boolean; push?: boolean; promos?: boolean }
  card?: { brand?: string; last4?: string; exp?: string; name?: string }
  billing?: { name?: string; rut?: string }
}
