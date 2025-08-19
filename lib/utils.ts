import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Base pública donde sirven las imágenes
const IMG_BASE = "https://crea-tendencia-images.vercel.app"

// Convierte un ID (p.ej. "abc123") en URL completa "http://.../images/abc123"
// Si ya viene una URL absoluta (http/https/data/blob), la deja igual.
export function img(src?: string) {
  if (!src) return "/j.png"
  const isAbsolute = /^(https?:|data:|blob:)/i.test(src)
  if (isAbsolute) return src
  // si parece un ID (sin slashes, alfanumérico, guiones, underscores)
  const looksLikeId = /^[A-Za-z0-9_-]{8,}$/.test(src)
  if (looksLikeId) return `${IMG_BASE}/images/${src}`
  // último recurso: si vino una ruta relativa de tu app, también vale
  return src
}
