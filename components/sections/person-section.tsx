"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import type { ContentData } from "@/types"

interface PersonSectionProps {
  currentContent: ContentData["content"]["es"]
  scrollToSection: (anchor: string) => void
  img: (src?: string) => string
  btnPrimary: string
}

export const PersonSection: React.FC<PersonSectionProps> = ({ currentContent, scrollToSection, img, btnPrimary }) => {
  return (
    <section id="person" className="py-20 bg-[var(--bg)] animate-section">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <img
          src={img(currentContent.person.photo) || "/placeholder.svg"}
          alt={currentContent.person.name}
          className="person-avatar mx-auto"
        />

        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">{currentContent.person.name}</h1>
        <h2 className="text-xl text-[var(--text-secondary)] mb-6">{currentContent.person.title}</h2>
        <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">{currentContent.person.bio}</p>
        <Button onClick={() => scrollToSection("#experience")} className={btnPrimary}>
          {currentContent.person.experienceButton}
        </Button>
      </div>
    </section>
  )
}
