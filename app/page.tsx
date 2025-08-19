"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

// Hooks
import { useTheme } from "@/hooks/use-theme"
import { useAnalytics } from "@/hooks/use-analytics"

// Components
import { Header } from "@/components/sections/header/header"
import { HeroSection } from "@/components/sections/hero/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { PersonSection } from "@/components/sections/person-section"
import { ExperienceSection } from "@/components/sections/experience-section"
import { ConsultationSection } from "@/components/sections/consultation-section"
import { ServicesSection } from "@/components/sections/services/services-section"
import { TeamSection } from "@/components/sections/team/team-section"
import { CasesSection } from "@/components/sections/cases-section"
import { ContactSection } from "@/components/sections/contact/contact-section"
import { SocialMediaSection } from "@/components/sections/social-media-section"
import { Footer } from "@/components/sections/footer"
import { scrollToSection, getFilteredMenuItems } from "@/lib/navigation-utils"
import { ApiService } from "@/services/api-service"

// Types and Constants
import type { ContentData, EntityType, Language } from "@/types"

export default function DixitLawTemplate() {
  // State
  const [content, setContent] = useState<ContentData | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<Language>("es")
  const [entityType, setEntityType] = useState<EntityType>("firm")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Hooks
  const { isDark, toggleTheme, setTheme } = useTheme()
  const { incrementVisitorCount, trackPageClick, trackContactClick } = useAnalytics()

  // Refs
  const observerRef = useRef<IntersectionObserver | null>(null)

  // URL params
  const searchParams = useSearchParams()
  const code = searchParams.get("code")

  // Load content from API
  useEffect(() => {
    if (!code) {
      setError("Código de perfil no proporcionado")
      setLoading(false)
      return
    }

    let cancelled = false

    const loadContent = async () => {
      try {
        const data = await ApiService.loadProfile(code)
        if (cancelled) return

        setContent(data)
        setEntityType(data.settings.entityType)
        setCurrentLanguage(data.settings.defaultLanguage)

        // Apply theme from backend if user hasn't set preference
        const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null
        if (!stored) {
          setTheme(data.settings.theme)
        }

        incrementVisitorCount()
      } catch (err: any) {
        console.error("Error loading content:", err)
        setError(err.message || "Error al cargar el perfil")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadContent()

    return () => {
      cancelled = true
    }
  }, [code, setTheme, incrementVisitorCount])

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    const animateElements = document.querySelectorAll(".animate-section")
    animateElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [content, currentLanguage])

  // Handlers
  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang)
  }

  const toggleEntityType = () => {
    setEntityType((prev) => {
      const next = prev === "firm" ? "person" : "firm"
      setContent((prevContent) =>
        prevContent ? { ...prevContent, settings: { ...prevContent.settings, entityType: next } } : prevContent,
      )
      return next
    })
  }

  const handleScrollToSection = (anchor: string) => {
    scrollToSection(anchor, setMobileMenuOpen)
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button onClick={() => (window.location.href = "/setup")}>Crear nuevo perfil</Button>
        </div>
      </div>
    )
  }

  // No content state
  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Perfil no encontrado</h1>
          <p className="text-gray-600 mb-8">El perfil que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => (window.location.href = "/setup")}>Crear nuevo perfil</Button>
        </div>
      </div>
    )
  }

  const currentContent = content?.content?.[currentLanguage]
  if (!currentContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contenido no disponible</h1>
          <p className="text-gray-600 mb-8">El contenido para este idioma no está disponible.</p>
          <Button onClick={() => (window.location.href = "/setup")}>Crear nuevo perfil</Button>
        </div>
      </div>
    )
  }

  // CSS Variables and styling
  const btnPrimary = "bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white"

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "dark" : ""}`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=${content.styling.fontFamily}:wght@400;600;700&display=swap');
        
        :root {
          --primary-color: ${isDark ? content.styling.dark.primaryColor : content.styling.light.primaryColor};
          --secondary-color: ${isDark ? content.styling.dark.secondaryColor : content.styling.light.secondaryColor};
          --bg: ${isDark ? content.styling.dark.backgroundColor : content.styling.light.backgroundColor};
          --text-primary: ${isDark ? content.styling.dark.textPrimary : content.styling.light.textPrimary};
          --text-secondary: ${isDark ? content.styling.dark.textSecondary : content.styling.light.textSecondary};
          --border: ${isDark ? content.styling.dark.borderColor : content.styling.light.borderColor};
          --card-bg: ${isDark ? content.styling.dark.cardBackground : content.styling.light.cardBackground};
          --footer-bg: ${isDark ? content.styling.dark.footerBackground : content.styling.light.footerBackground};
          --footer-text: ${isDark ? content.styling.dark.footerText : content.styling.light.footerText};
          --font-family: '${content.styling.fontFamily}', sans-serif;
          --font-size-small: ${content.styling.fontSize.small};
          --font-size-base: ${content.styling.fontSize.base};
          --font-size-large: ${content.styling.fontSize.large};
          --font-size-xl: ${content.styling.fontSize.xl};
          --font-size-2xl: ${content.styling.fontSize["2xl"]};
          --font-size-3xl: ${content.styling.fontSize["3xl"]};
          --font-size-4xl: ${content.styling.fontSize["4xl"]};
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          background-color: var(--bg);
          color: var(--text-primary);
          font-family: var(--font-family);
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        h1, h2, h3, h4 {
          margin: 0 0 1rem;
          font-weight: 700;
        }
        
        h1 { font-size: var(--font-size-4xl); }
        h2 { font-size: var(--font-size-3xl); }
        h3 { font-size: var(--font-size-2xl); }
        h4 { font-size: var(--font-size-xl); }
        
        p {
          margin: 0 0 1rem;
          line-height: 1.5;
          color: var(--text-secondary);
          font-size: var(--font-size-base);
        }
        
        a {
          text-decoration: none;
          color: inherit;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .animate-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-section.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .staggered-animation {
          transition-delay: calc(var(--index) * 0.1s);
        }
        
        #hero {
          height: 100vh;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        
        #hero::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.5)"};
          opacity: 0.7;
        }
        
        .hero-content {
          position: relative;
          z-index: 1;
          color: white;
          padding: 0 1rem;
          max-width: 1200px;
          width: 100%;
        }
        
        .hero-title {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: fadeInDown 0.8s ease-out forwards;
        }
        
        .hero-subtitle {
          font-size: var(--font-size-xl);
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .hero-features {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        
        .person-avatar {
          border-radius: 50%;
          width: 200px;
          height: 200px;
          object-fit: cover;
          border: 4px solid var(--primary-color);
          margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <Header
        currentContent={currentContent}
        entityType={entityType}
        isDark={isDark}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        toggleEntityType={toggleEntityType}
        handleLanguageChange={handleLanguageChange}
        toggleTheme={toggleTheme}
        getFilteredMenuItems={() => getFilteredMenuItems(currentContent.header.menuItems, entityType)}
        scrollToSection={handleScrollToSection}
        enableDarkModeToggle={content.settings.enableDarkModeToggle}
      />

      {/* Hero Section */}
      <HeroSection
        currentContent={currentContent}
        entityType={entityType}
        scrollToSection={handleScrollToSection}
        btnPrimary={btnPrimary}
      />

      {/* About Section (only for firm) */}
      {entityType === "firm" && (
        <AboutSection currentContent={currentContent} scrollToSection={handleScrollToSection} btnPrimary={btnPrimary} />
      )}

      {/* Person Section (only for person) */}
      {entityType === "person" && (
        <PersonSection
          currentContent={currentContent}
          scrollToSection={handleScrollToSection}
          btnPrimary={btnPrimary}
        />
      )}

      {/* Experience Section (only for person) */}
      {entityType === "person" && <ExperienceSection currentContent={currentContent} />}

      {/* Consultation Section */}
      <ConsultationSection currentContent={currentContent} trackContactClick={trackContactClick} />

      {/* Services Section */}
      <ServicesSection
        currentContent={currentContent}
        scrollToSection={handleScrollToSection}
        btnPrimary={btnPrimary}
      />

      {/* Team Section (only for firm) */}
      {entityType === "firm" && (
        <TeamSection currentContent={currentContent} trackPageClick={trackPageClick} btnPrimary={btnPrimary} />
      )}

      {/* Cases Section */}
      <CasesSection
        currentContent={currentContent}
        scrollToSection={handleScrollToSection}
        trackPageClick={trackPageClick}
        btnPrimary={btnPrimary}
      />

      {/* Contact Section */}
      <ContactSection currentContent={currentContent} trackPageClick={trackPageClick} />

      {/* Social Media Section */}
      <SocialMediaSection
        currentContent={currentContent}
        scrollToSection={handleScrollToSection}
        trackPageClick={trackPageClick}
        btnPrimary={btnPrimary}
      />

      {/* Footer */}
      <Footer
        currentContent={currentContent}
        scrollToSection={handleScrollToSection}
        handleLanguageChange={handleLanguageChange}
      />
    </div>
  )
}
