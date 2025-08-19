import type React from "react"
const IMAGE_API_BASE = "https://crea-tendencia-images.vercel.app/images"

export function img(src?: string): string {
  if (!src) return "/placeholder.svg"

  // Si es una URL completa, devolverla tal como está
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src
  }

  // Si es un ID de imagen (sin extensión y sin /), construir URL de la API
  if (!src.includes("/") && !src.includes(".")) {
    return `${IMAGE_API_BASE}/get-image/${src}`
  }

  // Si es una ruta local, devolverla tal como está
  return src
}

export function createImageUploadHandler(
  setPreviewUrls: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  setImageUploads: React.Dispatch<React.SetStateAction<Record<string, File | null>>>,
) {
  return (path: string[], event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    const pathKey = path.join(".")

    setPreviewUrls((prev) => ({ ...prev, [pathKey]: previewUrl }))
    setImageUploads((prev) => ({ ...prev, [pathKey]: file }))
  }
}
