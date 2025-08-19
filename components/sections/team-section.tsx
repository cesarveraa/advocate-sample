"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { ContentData } from "@/types"

interface TeamSectionProps {
  currentContent: ContentData["content"]["es"]
  scrollToSection: (anchor: string) => void
  img: (src?: string) => string
  trackPageClick: (section: string) => void
  btnPrimary: string
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  currentContent,
  scrollToSection,
  img,
  trackPageClick,
  btnPrimary,
}) => {
  return (
    <section id="team" className="py-20 bg-[var(--bg)] animate-section">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">{currentContent.team.title}</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentContent.team.members.map((member, index) => (
            <Card
              key={index}
              className="bg-[var(--card-bg)] border-[var(--border)] text-center animate-section staggered-animation"
              style={{ "--index": index } as React.CSSProperties}
            >
              <CardContent className="p-6">
                <img
                  src={img(member.photo) || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />

                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{member.name}</h3>
                <p className="text-[var(--text-secondary)] mb-4 text-sm">{member.role}</p>
                <Button onClick={() => trackPageClick("team")} className={btnPrimary}>
                  {member.bioButton}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
