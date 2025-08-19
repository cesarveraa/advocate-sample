"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { ContentData } from "@/types"

interface ServicesSectionProps {
  currentContent: ContentData["content"]["es"]
  scrollToSection: (anchor: string) => void
  img: (src?: string) => string
  btnPrimary: string
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  currentContent,
  scrollToSection,
  img,
  btnPrimary,
}) => {
  return (
    <section id="services" className="py-20 bg-[var(--bg)] animate-section">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">
          {currentContent.services.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {currentContent.services.items.map((service, index) => (
            <Card
              key={index}
              className="bg-[var(--card-bg)] border-[var(--border)] animate-section staggered-animation"
              style={{ "--index": index } as React.CSSProperties}
            >
              <CardContent className="p-6">
                <img
                  src={img(service.icon) || "/placeholder.svg"}
                  alt={`${service.title} icon`}
                  className="w-12 h-12 mb-4"
                />

                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{service.title}</h3>
                <p className="text-[var(--text-secondary)] mb-6">{service.description}</p>
                <Button onClick={() => scrollToSection(service.buttonLink)} className={btnPrimary}>
                  {service.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
