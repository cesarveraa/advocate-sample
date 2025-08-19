"use client"

import { useCallback } from "react"

export function useAnalytics() {
  const incrementVisitorCount = useCallback(() => {
    console.log("Analytics: Visitor count incremented")
  }, [])

  const trackPageClick = useCallback((section: string) => {
    console.log(`Analytics: Page click - ${section}`)
  }, [])

  const trackContactClick = useCallback((type: string) => {
    console.log(`Analytics: Contact click - ${type}`)
  }, [])

  return {
    incrementVisitorCount,
    trackPageClick,
    trackContactClick,
  }
}
