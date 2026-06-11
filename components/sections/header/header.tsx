"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Moon, Sun } from "lucide-react"
import type { LanguageContent, EntityType, MenuItem } from "@/types"

interface HeaderProps {
  currentContent: LanguageContent
  entityType: EntityType
  isDark: boolean
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  toggleEntityType: () => void
  handleLanguageChange: (lang: string) => void
  toggleTheme: () => void
  getFilteredMenuItems: () => MenuItem[]
  scrollToSection: (anchor: string) => void
  enableDarkModeToggle: boolean
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
  enableDarkModeToggle,
}) => {
  return (
    <>
      {/* Barra fija */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/90 backdrop-blur-sm border-b border-[var(--border)]">
        {/* Altura fija → todo alineado verticalmente */}
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-6">
          {/* Logo con letter-spacing, sin márgenes verticales extras */}
          <h1 className="whitespace-nowrap text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-[0.08em] md:tracking-[0.12em] leading-none">
            {currentContent.header.logoText}
          </h1>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-10">
            {getFilteredMenuItems().map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.anchor)}
                className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors tracking-[0.06em]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Botones a la derecha */}
          <div className="flex items-center gap-2 md:gap-4">
            {enableDarkModeToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-[var(--text-primary)]"
                aria-label="Cambiar tema"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[var(--text-primary)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[var(--bg)]/95 backdrop-blur-sm border-t border-[var(--border)]">
            <nav className="container mx-auto px-4 py-5 space-y-3">
              {getFilteredMenuItems().map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.anchor)}
                  className="block w-full text-left text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors tracking-[0.06em] py-2"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t border-[var(--border)]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleEntityType}
                  className="w-full border-[var(--primary-color)] text-[var(--primary-color)] bg-transparent tracking-[0.06em]"
                >
                  {entityType === "firm"
                    ? currentContent.ui.entityToggle.switchToPerson
                    : currentContent.ui.entityToggle.switchToFirm}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer igual a la altura real del header → sin “rectángulo gris” extra */}
      <div aria-hidden className="h-16 md:h-20" />
    </>
  )
}
