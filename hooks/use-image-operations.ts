"use client"

import type React from "react"

import { useState } from "react"

export function useImageOperations() {
  const [imageUploads, setImageUploads] = useState<Record<string, File | null>>({})
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})

  const handleImageUpload = (path: string[], event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    const pathKey = path.join(".")
    setPreviewUrls((prev) => ({ ...prev, [pathKey]: previewUrl }))
    setImageUploads((prev) => ({ ...prev, [pathKey]: file }))
  }

  return {
    imageUploads,
    setImageUploads,
    previewUrls,
    setPreviewUrls,
    handleImageUpload,
  }
}
