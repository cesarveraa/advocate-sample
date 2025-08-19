"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ContentData } from "@/types"
import { defaultContent } from "@/constants/default-content"
import { createProfile } from "@/services/profile-service"

export function useSetupWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [contentData, setContentData] = useState<ContentData>(defaultContent)
  const [activeLanguage, setActiveLanguage] = useState("es")
  const [saveStatus, setSaveStatus] = useState("")
  const [imageUploads, setImageUploads] = useState<Record<string, File | null>>({})
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const steps = [
    "Configuración Básica",
    "Información General",
    "Servicios",
    "Equipo",
    "Casos de Éxito",
    "Contacto",
    "Finalizar",
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleCreateProfile = async () => {
    setIsSubmitting(true)
    setSaveStatus("Subiendo imágenes...")

    try {
      const profile = await createProfile(contentData, imageUploads, setSaveStatus)
      setSaveStatus("¡Perfil creado con éxito!")

      setTimeout(() => {
        router.push(`/?code=${profile.code}`)
      }, 1200)
    } catch (e) {
      console.error("🚨 Exception en createProfile:", e)
      setSaveStatus("Error al crear el perfil. Inténtalo de nuevo.")
      setIsSubmitting(false)
    }
  }

  return {
    currentStep,
    setCurrentStep,
    contentData,
    setContentData,
    activeLanguage,
    setActiveLanguage,
    saveStatus,
    setSaveStatus,
    imageUploads,
    setImageUploads,
    previewUrls,
    setPreviewUrls,
    isSubmitting,
    setIsSubmitting,
    steps,
    nextStep,
    prevStep,
    handleCreateProfile,
  }
}
