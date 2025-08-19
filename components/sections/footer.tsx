"use client"

import type React from "react"
import type { ContentData } from "@/types"

interface FooterProps {
  currentContent: ContentData["content"]["es"]
  scrollToSection: (anchor: string) => void
  handleLanguageChange: (lang: string) => void
}

export const Footer: React.FC<FooterProps> = ({ currentContent, scrollToSection, handleLanguageChange }) => {
  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)] py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {currentContent.footer.quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.anchor)}
                    className="text-[var(--primary-color)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {currentContent.footer.resources.map((resource, index) => (
                <li key={index}>
                  <a href={resource.url} className="text-[var(--primary-color)] hover:text-white transition-colors">
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{currentContent.footer.languageSelector}</h4>
            <select
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <hr className="border-gray-700 mb-8" />

        <div className="text-center text-sm text-gray-400">
          <p>{currentContent.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
