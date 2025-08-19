export * from "./content"
export * from "./settings"
export * from "./styling"
export * from "./analytics"

import type { Settings } from "./settings"
import type { Styling } from "./styling"
import type { Analytics } from "./analytics"
import type { LanguageContent } from "./content"

export interface ContentData {
  settings: Settings
  styling: Styling
  analytics: Analytics
  content: Record<string, LanguageContent>
}
