"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { HeroFeatureCard } from "./hero-feature-card"
import { img } from "@/lib/image-utils"
import type { LanguageContent, EntityType } from "@/types"

interface HeroSectionProps {
  currentContent: LanguageContent
  entityType: EntityType
  scrollToSection: (anchor: string) => void
  btnPrimary: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentContent,
  entityType,
  scrollToSection,
  btnPrimary,
}) => {
  return (
    <section id="hero" style={{ backgroundImage: `url(${img(currentContent.hero.backgroundImage)})` }}>
      <div className="hero-content">
        <h1 className="hero-title">{currentContent.hero.title}</h1>
        <p className="hero-subtitle">{currentContent.hero.subtitle}</p>

        {entityType === "firm" ? (
          <div className="hero-features grid md:grid-cols-3 gap-8 mt-12">
            {currentContent.hero.features.map((feature, index) => (
              <HeroFeatureCard key={index} feature={feature} onButtonClick={scrollToSection} btnPrimary={btnPrimary} />
            ))}
          </div>
        ) : (
          <div className="hero-features">
            <Button
              onClick={() => scrollToSection("#experience")}
              className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white text-lg px-8 py-3"
            >
              {currentContent.person.learnMoreButton}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
