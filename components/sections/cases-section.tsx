"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { ContentData } from "@/types"

interface CasesSectionProps {
  currentContent: ContentData["content"]["es"]
  scrollToSection: (anchor: string) => void
  trackPageClick: (section: string) => void
  btnPrimary: string
}

export const CasesSection: React.FC<CasesSectionProps> = ({
  currentContent,
  scrollToSection,
  trackPageClick,
  btnPrimary,
}) => {
  return (
    <section id="cases" className="py-20 bg-[var(--bg)] animate-section">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">
          {currentContent.cases.title}
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {currentContent.cases.items.map((caseItem, index) => (
            <Card
              key={index}
              className="bg-[var(--card-bg)] border-[var(--border)] animate-section staggered-animation"
              style={{ "--index": index } as React.CSSProperties}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{caseItem.caseTitle}</h3>
                <p className="text-[var(--text-secondary)] mb-6">{caseItem.description}</p>
                <Button onClick={() => trackPageClick("cases")} className={btnPrimary}>
                  {caseItem.detailsButton}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
