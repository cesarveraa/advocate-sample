export type EntityType = "firm" | "person"
export type Theme = "light" | "dark" | "auto"
export type Language = "es" | "en"

export interface Settings {
  theme: Theme
  enableDarkModeToggle: boolean
  defaultLanguage: Language
  languages: Language[]
  entityType: EntityType
}
