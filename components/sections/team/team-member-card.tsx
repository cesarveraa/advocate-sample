"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { img } from "@/lib/image-utils"
import type { TeamMember } from "@/types"

interface TeamMemberCardProps {
  member: TeamMember
  index: number
  onButtonClick: (section: string) => void
  btnPrimary: string
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, index, onButtonClick, btnPrimary }) => {
  return (
    <Card
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
        <Button onClick={() => onButtonClick("team")} className={btnPrimary}>
          {member.bioButton}
        </Button>
      </CardContent>
    </Card>
  )
}
