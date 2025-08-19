"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { img } from "@/lib/image-utils"
import type { HeroFeature } from "@/types"

interface HeroFeatureCardProps {
  feature: HeroFeature
  onButtonClick: (link: string) => void
  btnPrimary: string
}

export const HeroFeatureCard: React.FC<HeroFeatureCardProps> = ({ feature, onButtonClick, btnPrimary }) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
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
        <Button onClick={() => onButtonClick(feature.buttonLink)} className={btnPrimary}>
          {feature.buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}
