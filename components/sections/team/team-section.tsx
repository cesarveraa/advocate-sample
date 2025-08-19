"use client"

import type React from "react"
import { TeamMemberCard } from "./team-member-card"
import type { LanguageContent } from "@/types"

interface TeamSectionProps {
  currentContent: LanguageContent
  trackPageClick: (section: string) => void
  btnPrimary: string
}

export const TeamSection: React.FC<TeamSectionProps> = ({ currentContent, trackPageClick, btnPrimary }) => {
  return (
    <section id="team" className="py-20 bg-[var(--bg)] animate-section">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">{currentContent.team.title}</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentContent.team.members.map((member, index) => (
            <TeamMemberCard
              key={index}
              member={member}
              index={index}
              onButtonClick={trackPageClick}
              btnPrimary={btnPrimary}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
