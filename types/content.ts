export interface MenuItem {
  label: string
  anchor: string
}

export interface HeroFeature {
  icon: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

export interface Hero {
  backgroundImage: string
  title: string
  subtitle: string
  features: HeroFeature[]
}

export interface About {
  title: string
  mission: string
  values: string
  buttonText: string
  buttonLink: string
}

export interface Experience {
  dateRange: string
  role: string
  details: string
}

export interface Person {
  photo: string
  name: string
  title: string
  bio: string
  experience: Experience[]
  careerHighlights: string[]
  experienceTitle: string
  highlightsTitle: string
  experienceButton: string
  learnMoreButton: string
}

export interface ContactInfo {
  address: string
  phone: string
  hours: string
  email: string
}

export interface Consultation {
  title: string
  subtitle: string
  icon: string
  contactInfo: ContactInfo
}

export interface Service {
  icon: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

export interface Services {
  title: string
  items: Service[]
}

export interface TeamMember {
  photo: string
  name: string
  role: string
  bioLink: string
  bioButton: string
}

export interface Team {
  title: string
  members: TeamMember[]
}

export interface Case {
  caseTitle: string
  description: string
  detailsLink: string
  detailsButton: string
}

export interface Cases {
  title: string
  items: Case[]
}

export interface FormField {
  label: string
  type: string
  name: string
  placeholder: string
}

export interface ContactDetails {
  address: string
  phone: string
  email: string
  hours: string
}

export interface ContactLocation {
  embedMapUrl: string
}

export interface Contact {
  title: string
  formFields: FormField[]
  submitButtonText: string
  location: ContactLocation
  details: ContactDetails
}

export interface FooterLink {
  label: string
  anchor: string
}

export interface FooterResource {
  label: string
  url: string
}

export interface Footer {
  quickLinks: FooterLink[]
  resources: FooterResource[]
  languageSelector: string
  copyright: string
}

export interface SocialNetwork {
  name: string
  url: string
  icon: string
}

export interface SocialMedia {
  title: string
  networks: SocialNetwork[]
  contactButton: string
  contactText: string
}

export interface UIEntityToggle {
  firmLabel: string
  personLabel: string
  switchToFirm: string
  switchToPerson: string
}

export interface UI {
  entityToggle: UIEntityToggle
}

export interface Header {
  logoText: string
  menuItems: MenuItem[]
}

export interface LanguageContent {
  header: Header
  hero: Hero
  about: About
  person: Person
  consultation: Consultation
  services: Services
  team: Team
  cases: Cases
  contact: Contact
  footer: Footer
  socialMedia: SocialMedia
  ui: UI
}
