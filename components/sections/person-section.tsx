"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import type { ContentData } from "@/types"

interface PersonSectionProps {
  currentContent: ContentData["content"]["es"]
  scrollToSection: (anchor: string) => void
  /** Opcional: puede ser una función (builder) o un string (prefijo/base URL) */
  img?: ((src?: string) => string) | string
  btnPrimary: string
}

function resolveImage(
  imgProp: PersonSectionProps["img"],
  raw?: string
): string {
  const val = raw ?? ""
  if (!imgProp) return val
  if (typeof imgProp === "function") {
    try {
      return imgProp(val) || val
    } catch {
      return val
    }
  }
  // Si es string, trátalo como prefijo/baseURL
  if (!val) return ""
  return imgProp.endsWith("/") ? `${imgProp}${val}` : `${imgProp}/${val}`
}

export const PersonSection: React.FC<PersonSectionProps> = ({
  currentContent,
  scrollToSection,
  img,
  btnPrimary,
}) => {
  const photo = resolveImage(img, currentContent?.person?.photo) || "/placeholder.svg"
  const name = currentContent?.person?.name || ""
  const title = currentContent?.person?.title || ""
  const bio = currentContent?.person?.bio || ""
  const cta = currentContent?.person?.experienceButton || "Ver experiencia"

  return (
    <section id="person" className="py-20 bg-[var(--bg)] animate-section">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <img
          src={photo}
          alt={name || "Foto de perfil"}
          className="person-avatar mx-auto"
        />

        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">{name}</h1>
        <h2 className="text-xl text-[var(--text-secondary)] mb-6">{title}</h2>
        <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">{bio}</p>

        <Button onClick={() => scrollToSection("#experience")} className={btnPrimary}>
          {cta}
        </Button>
      </div>
    </section>
  )
}
