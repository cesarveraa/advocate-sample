"use client"

import { useState } from "react"
import { createImageUploadHandler } from "@/lib/image-utils"

export function useImageUpload() {
  const [imageUploads, setImageUploads] = useState<Record<string, File | null>>({})
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})

  const handleImageUpload = createImageUploadHandler(setPreviewUrls, setImageUploads)

  const clearUploads = () => {
    setImageUploads({})
    setPreviewUrls({})
  }

  return {
    imageUploads,
    previewUrls,
    handleImageUpload,
    clearUploads,
  }
}
