"use client"

import { useState, useEffect } from "react"
import { applyTheme, saveThemePreference, getStoredThemePreference, getSystemTheme } from "@/lib/theme-utils"
import type { Theme } from "@/types"

export function useTheme(initialTheme: Theme = "auto") {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return

    const stored = getStoredThemePreference()
    if (stored === "dark") {
      setIsDark(true)
      return
    }
    if (stored === "light") {
      setIsDark(false)
      return
    }

    const systemDark = getSystemTheme()
    setIsDark(systemDark)

    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)

    mq.addEventListener?.("change", handler)
    // @ts-ignore - Support for older browsers
    mq.addListener?.(handler)

    return () => {
      mq.removeEventListener?.("change", handler)
      // @ts-ignore - Support for older browsers
      mq.removeListener?.(handler)
    }
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      saveThemePreference(next)
      return next
    })
  }

  const setTheme = (theme: Theme) => {
    const newIsDark = applyTheme(theme, isDark)
    setIsDark(newIsDark)
    if (theme !== "auto") {
      saveThemePreference(newIsDark)
    }
  }

  return { isDark, toggleTheme, setTheme }
}
