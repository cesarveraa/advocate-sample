"use client"

import type React from "react"
import { ServiceCard } from "./service-card"
import type { LanguageContent } from "@/types"

interface ServicesSectionProps {
  currentContent: LanguageContent
  scrollToSection: (anchor: string) => void
  btnPrimary: string
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ currentContent, scrollToSection, btnPrimary }) => {
  return (
    <section id="services" className="py-20 bg-[var(--bg)] animate-section">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">
          {currentContent.services.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {currentContent.services.items.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              index={index}
              onButtonClick={scrollToSection}
              btnPrimary={btnPrimary}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
