import type { Theme } from "@/types"

export function getSystemTheme(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function applyTheme(theme: Theme, isDark: boolean): boolean {
  switch (theme) {
    case "dark":
      return true
    case "light":
      return false
    case "auto":
      return getSystemTheme()
    default:
      return isDark
  }
}

export function saveThemePreference(isDark: boolean) {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }
}

export function getStoredThemePreference(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("theme")
}
