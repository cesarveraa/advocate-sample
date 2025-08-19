"use client"

import { useState, useEffect } from "react"
import type { ContentData } from "@/types"
import { profileService } from "@/services/profile-service"
import { ensureSkeleton } from "@/lib/content-utils"

export function useAdminContent(idToken: string | null, isLoggedIn: boolean) {
  const [contentData, setContentData] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isLoggedIn && idToken) {
      loadMyPage()
    } else {
      setLoading(false)
    }
  }, [isLoggedIn, idToken])

  const loadMyPage = async () => {
    if (!idToken) return

    try {
      const page = await profileService.getMyPage(idToken)
      setContentData(ensureSkeleton(page))
    } catch (error) {
      console.error("Error loading page:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    if (!contentData || !idToken) return
    setIsSaving(true)
    setSaveStatus("Guardando...")

    try {
      await profileService.updateMyPage(idToken, contentData)
      setSaveStatus("¡Guardado con éxito!")
    } catch (e) {
      console.error(e)
      setSaveStatus("¡Error al guardar!")
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveStatus(""), 3000)
    }
  }

  return {
    contentData,
    setContentData,
    loading,
    saveStatus,
    isSaving,
    loadMyPage,
    saveContent,
  }
}
