"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { ContentData } from "@/types"

interface HeroSectionProps {
  currentContent: ContentData["content"]["es"]
  entityType: "firm" | "person"
  scrollToSection: (anchor: string) => void
  img: (src?: string) => string
  btnPrimary: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentContent,
  entityType,
  scrollToSection,
  img,
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
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <img
                    src={img(feature.icon) || "/placeholder.svg"}
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = "/j.png"
                    }}
                    alt={`${feature.title} icon`}
                    className="w-16 h-16 mx-auto mb-4 filter brightness-0 invert"
                  />

                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="mb-4 text-white/80">{feature.description}</p>
                  <Button onClick={() => scrollToSection(feature.buttonLink)} className={btnPrimary}>
                    {feature.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="hero-features">
            <Button
              onClick={() => scrollToSection("#experience")}
              className={`bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white text-lg px-8 py-3`}
            >
              {currentContent.person.learnMoreButton}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
