"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react"
import type { ContentData } from "@/types"

interface SocialMediaSectionProps {
  currentContent: ContentData["content"]["es"]
  scrollToSection: (anchor: string) => void
  trackPageClick: (section: string) => void
  btnPrimary: string
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  currentContent,
  scrollToSection,
  trackPageClick,
  btnPrimary,
}) => {
  return (
    <section id="social-media" className="py-16 bg-[var(--primary-color)]/10 animate-section">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8">{currentContent.socialMedia.title}</h2>

        <div className="flex justify-center gap-8 mb-10">
          {currentContent.socialMedia.networks.map((network, index) => (
            <a
              key={index}
              href={network.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-primary)] hover:text-[var(--primary-color)] transition-colors transform hover:scale-110"
              aria-label={network.name}
            >
              {network.icon === "facebook" && <Facebook size={32} />}
              {network.icon === "twitter" && <Twitter size={32} />}
              {network.icon === "linkedin" && <Linkedin size={32} />}
              {network.icon === "instagram" && <Instagram size={32} />}
              {network.icon === "youtube" && <Youtube size={32} />}
            </a>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="text-[var(--text-secondary)] text-lg mb-6">{currentContent.socialMedia.contactText}</p>
          <Button
            onClick={() => scrollToSection("#contact")}
            className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white px-8 py-3 text-lg"
          >
            {currentContent.socialMedia.contactButton}
          </Button>
        </div>
      </div>
    </section>
  )
}
