"use client"

import type React from "react"
import { MapPin, Phone, Clock, Mail } from "lucide-react"
import type { ContentData } from "@/types"

interface ConsultationSectionProps {
  currentContent: ContentData["content"]["es"]
  trackContactClick: (type: string) => void
}

export const ConsultationSection: React.FC<ConsultationSectionProps> = ({ currentContent, trackContactClick }) => {
  return (
    <section id="consultation" className="py-20 bg-[var(--bg)] animate-section">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-4">
          {currentContent.consultation.title}
        </h2>
        <p className="text-xl text-[var(--text-secondary)] text-center mb-8">{currentContent.consultation.subtitle}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <MapPin className="w-8 h-8 text-[var(--text-primary)] mb-2" />
            <p className="text-[var(--text-secondary)]">{currentContent.consultation.contactInfo.address}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Phone className="w-8 h-8 text-[var(--text-primary)] mb-2" />
            <a
              href={`tel:${currentContent.consultation.contactInfo.phone}`}
              className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
              onClick={() => trackContactClick("phone")}
            >
              {currentContent.consultation.contactInfo.phone}
            </a>
          </div>
          <div className="flex flex-col items-center text-center">
            <Clock className="w-8 h-8 text-[var(--text-primary)] mb-2" />
            <p className="text-[var(--text-secondary)]">{currentContent.consultation.contactInfo.hours}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Mail className="w-8 h-8 text-[var(--text-primary)] mb-2" />
            <a
              href={`mailto:${currentContent.consultation.contactInfo.email}`}
              className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
              onClick={() => trackContactClick("email")}
            >
              {currentContent.consultation.contactInfo.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
