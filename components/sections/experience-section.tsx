"use client"

import type React from "react"
import type { ContentData } from "@/types"

interface ExperienceSectionProps {
  currentContent: ContentData["content"]["es"]
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ currentContent }) => {
  return (
    <section id="experience" className="py-20 bg-[var(--bg)] animate-section">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">
          {currentContent.person.experienceTitle}
        </h2>

        <div className="space-y-8 mb-12">
          {currentContent.person.experience.map((exp, index) => (
            <div
              key={index}
              className="experience-item animate-section staggered-animation"
              style={{ "--index": index } as React.CSSProperties}
            >
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                {exp.dateRange}: {exp.role}
              </h3>
              <p className="text-[var(--text-secondary)]">{exp.details}</p>
            </div>
          ))}
        </div>

        <div className="animate-section">
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
            {currentContent.person.highlightsTitle}
          </h3>
          <ul className="space-y-3">
            {currentContent.person.careerHighlights.map((highlight, index) => (
              <li key={index} className="text-[var(--text-secondary)] flex items-start">
                <span className="text-[var(--primary-color)] mr-2">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
