"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { img } from "@/lib/image-utils"
import type { Service } from "@/types"

interface ServiceCardProps {
  service: Service
  index: number
  onButtonClick: (link: string) => void
  btnPrimary: string
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, onButtonClick, btnPrimary }) => {
  return (
    <Card
      className="bg-[var(--card-bg)] border-[var(--border)] animate-section staggered-animation"
      style={{ "--index": index } as React.CSSProperties}
    >
      <CardContent className="p-6">
        <img src={img(service.icon) || "/placeholder.svg"} alt={`${service.title} icon`} className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{service.title}</h3>
        <p className="text-[var(--text-secondary)] mb-6">{service.description}</p>
        <Button onClick={() => onButtonClick(service.buttonLink)} className={btnPrimary}>
          {service.buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}
