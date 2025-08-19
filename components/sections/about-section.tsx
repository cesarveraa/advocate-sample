"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import type { ContentData } from "@/types"

interface AboutSectionProps {
  currentContent: ContentData["content"]["es"]
  scrollToSection: (anchor: string) => void
  btnPrimary: string
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentContent, scrollToSection, btnPrimary }) => {
  return (
    <section id="about" className="py-20 bg-[var(--bg)] animate-section">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8">{currentContent.about.title}</h2>
        <hr className="w-1/2 mx-auto border-[var(--border)] mb-8" />
        <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">{currentContent.about.mission}</p>
        <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">{currentContent.about.values}</p>
        <Button onClick={() => scrollToSection(currentContent.about.buttonLink)} className={btnPrimary}>
          {currentContent.about.buttonText}
        </Button>
      </div>
    </section>
  )
}
