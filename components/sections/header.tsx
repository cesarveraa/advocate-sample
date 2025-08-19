"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Moon, Sun } from "lucide-react"
import type { ContentData } from "@/types"

interface HeaderProps {
  currentContent: ContentData["content"]["es"]
  entityType: "firm" | "person"
  isDark: boolean
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  toggleEntityType: () => void
  handleLanguageChange: (lang: string) => void
  toggleTheme: () => void
  getFilteredMenuItems: () => Array<{ label: string; anchor: string }>
  scrollToSection: (anchor: string) => void
}

export const Header: React.FC<HeaderProps> = ({
  currentContent,
  entityType,
  isDark,
  mobileMenuOpen,
  setMobileMenuOpen,
  toggleEntityType,
  handleLanguageChange,
  toggleTheme,
  getFilteredMenuItems,
  scrollToSection,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/90 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{currentContent.header.logoText}</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {getFilteredMenuItems().map((item, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(item.anchor)}
              className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-[var(--text-primary)]">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[var(--text-primary)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg)]/95 backdrop-blur-sm border-t border-[var(--border)]">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            {getFilteredMenuItems().map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.anchor)}
                className="block w-full text-left text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
