export interface PageClicks {
  hero: number
  services: number
  team: number
  cases: number
  contact: number
  experience: number
}

export interface ContactClicks {
  whatsapp: number
  email: number
  phone: number
}

export interface Analytics {
  visitorCount: number
  visitorLocations: string[]
  pageClicks: PageClicks
  contactClicks: ContactClicks
}
