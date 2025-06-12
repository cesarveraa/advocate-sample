"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import {
  Menu,
  X,
  MapPin,
  Phone,
  Clock,
  Mail,
  Moon,
  Sun,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ContentData {
  settings: {
    defaultLanguage: string
    languages: string[]
    entityType: "firm" | "person"
    theme?: "light" | "dark" | "auto"
    enableDarkModeToggle?: boolean
  }
  styling: {
    light: {
      primaryColor: string
      secondaryColor: string
      backgroundColor: string
      textPrimary: string
      textSecondary: string
      borderColor: string
      cardBackground: string
      footerBackground: string
      footerText: string
    }
    dark: {
      primaryColor: string
      secondaryColor: string
      backgroundColor: string
      textPrimary: string
      textSecondary: string
      borderColor: string
      cardBackground: string
      footerBackground: string
      footerText: string
    }
    fontFamily: string
    fontSize: {
      small: string
      base: string
      large: string
      xl: string
      "2xl": string
      "3xl": string
      "4xl": string
    }
  }
  analytics: {
    visitorCount: number
    visitorLocations: string[]
    pageClicks: Record<string, number>
    contactClicks: Record<string, number>
  }
  content: {
    [key: string]: {
      header: {
        logoText: string
        menuItems: Array<{ label: string; anchor: string }>
      }
      hero: {
        backgroundImage: string
        title: string
        subtitle: string
        features: Array<{
          icon: string
          title: string
          description: string
          buttonText: string
          buttonLink: string
        }>
      }
      about: {
        title: string
        mission: string
        values: string
        buttonText: string
        buttonLink: string
      }
      person: {
        photo: string
        name: string
        title: string
        bio: string
        experience: Array<{
          dateRange: string
          role: string
          details: string
        }>
        careerHighlights: string[]
        experienceTitle: string
        highlightsTitle: string
        experienceButton: string
        learnMoreButton: string
      }
      consultation: {
        title: string
        subtitle: string
        icon: string
        contactInfo: {
          address: string
          phone: string
          hours: string
          email: string
        }
      }
      services: {
        title: string
        items: Array<{
          icon: string
          title: string
          description: string
          buttonText: string
          buttonLink: string
        }>
      }
      team: {
        title: string
        members: Array<{
          photo: string
          name: string
          role: string
          bioLink: string
          bioButton: string
        }>
      }
      cases: {
        title: string
        items: Array<{
          caseTitle: string
          description: string
          detailsLink: string
          detailsButton: string
        }>
      }
      contact: {
        title: string
        formFields: Array<{
          label: string
          type: string
          name: string
          placeholder: string
        }>
        submitButtonText: string
        location: {
          embedMapUrl: string
        }
        details: {
          address: string
          phone: string
          email: string
          hours: string
        }
      }
      footer: {
        quickLinks: Array<{ label: string; anchor: string }>
        resources: Array<{ label: string; url: string }>
        languageSelector: string
        copyright: string
      }
      ui: {
        entityToggle: {
          firmLabel: string
          personLabel: string
          switchToFirm: string
          switchToPerson: string
        }
      }
      socialMedia: {
        title: string
        networks: Array<{
          name: string
          url: string
          icon: string
        }>
        contactButton: string
        contactText: string
      }
    }
  }
}

export default function DixitLawTemplate() {
  const [content, setContent] = useState<ContentData | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("es")
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [entityType, setEntityType] = useState<"firm" | "person">("firm")
  const [isDark, setIsDark] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const code = searchParams.get("code")

  useEffect(() => {
    if (!code) {
      setError("Código de perfil no proporcionado")
      setLoading(false)
      return
    }

    // Load content from API
    fetch(`http://localhost:8000/lawyers/${code}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Perfil no encontrado")
          }
          throw new Error("Error al cargar el perfil")
        }
        return res.json()
      })
      .then(({ data }: { data: ContentData }) => {
        setContent(data)
        setEntityType(data.settings.entityType)
        setCurrentLanguage(data.settings.defaultLanguage)

        // Set initial theme
        if (data.settings.theme === "dark") {
          setIsDark(true)
        } else if (data.settings.theme === "light") {
          setIsDark(false)
        } else if (data.settings.theme === "auto") {
          setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
        }

        // Analytics - increment visitor count
        incrementVisitorCount()
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error loading content:", err)
        setError(err.message)
        setLoading(false)
      })
  }, [code])

  useEffect(() => {
    // Setup Intersection Observer for animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    // Observe all animate-section elements
    const animateElements = document.querySelectorAll(".animate-section")
    animateElements.forEach((el) => {
      observerRef.current?.observe(el)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [content, currentLanguage])

  const incrementVisitorCount = () => {
    console.log("Analytics: Visitor count incremented")
  }

  const trackPageClick = (section: string) => {
    console.log(`Analytics: Page click - ${section}`)
  }

  const trackContactClick = (type: string) => {
    console.log(`Analytics: Contact click - ${type}`)
  }

  const toggleEntityType = () => {
    const newType = entityType === "firm" ? "person" : "firm"
    setEntityType(newType)
    if (content) {
      setContent({
        ...content,
        settings: {
          ...content.settings,
          entityType: newType,
        },
      })
    }
  }

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang)
  }

  const scrollToSection = (anchor: string) => {
    const element = document.querySelector(anchor)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      const section = anchor.replace("#", "")
      trackPageClick(section)
    }
    setMobileMenuOpen(false)
  }

  const getFilteredMenuItems = () => {
    if (!content || !content.content[currentLanguage]) return []
    return content.content[currentLanguage].header.menuItems.filter((item) => {
      if (entityType === "person" && item.anchor === "#team") {
        return false
      }
      if (entityType === "firm" && item.anchor === "#experience") {
        return false
      }
      return true
    })
  }

  const getCurrentContent = () => {
    if (!content || !content.content[currentLanguage]) return null
    return content.content[currentLanguage]
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    localStorage.setItem("theme", !isDark ? "dark" : "auto")
  }

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

  const currentContent = getCurrentContent()
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
        
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        
        .grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        
        .grid-1 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        @media (max-width: 768px) {
          .grid-3, .grid-2 {
            grid-template-columns: 1fr;
          }
        }
        
        .btn-primary {
          background-color: var(--primary-color);
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.2s ease, filter 0.2s ease;
          font-weight: 600;
          font-size: var(--font-size-base);
        }
        
        .btn-primary:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
        
        .btn-secondary {
          background-color: transparent;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
          font-weight: 600;
          font-size: var(--font-size-base);
        }
        
        .btn-secondary:hover {
          transform: scale(1.05);
          background-color: var(--primary-color);
          color: white;
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
        
        .card, .case-card, .team-member, .experience-item {
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1rem;
          transition: opacity 0.6s ease-out, transform 0.6s ease-out, background-color 0.3s ease, border-color 0.3s ease;
        }
        
        .input-field {
          width: 100%;
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 0.5rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
          transition: background-color 0.3s ease, border-color 0.3s ease;
          font-size: var(--font-size-base);
        }
        
        .input-field::placeholder {
          color: var(--text-secondary);
        }
        
        .avatar {
          border-radius: 50%;
          width: 150px;
          height: 150px;
          object-fit: cover;
          margin-bottom: 0.5rem;
        }
        
        .person-avatar {
          border-radius: 50%;
          width: 200px;
          height: 200px;
          object-fit: cover;
          border: 4px solid var(--primary-color);
          margin-bottom: 1rem;
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
        
        .staggered-animation {
          transition-delay: calc(var(--index) * 0.1s);
        }
      `}</style>

      {/* Header */}
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
            {/* Entity Type Toggle */}
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-[var(--text-secondary)]">{currentContent.ui.entityToggle.firmLabel}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleEntityType}
                className="h-8 px-2 border-[var(--primary-color)] text-[var(--primary-color)]"
              >
                {entityType === "firm"
                  ? currentContent.ui.entityToggle.switchToPerson
                  : currentContent.ui.entityToggle.switchToFirm}
              </Button>
              <span className="text-xs text-[var(--text-secondary)]">{currentContent.ui.entityToggle.personLabel}</span>
            </div>

            {/* Language Toggle */}
            <select
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border)] rounded px-2 py-1 text-sm"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>

            {/* Theme Toggle */}
            {content.settings.enableDarkModeToggle && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-[var(--text-primary)]">
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}

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

      {/* Hero Section */}
      <section id="hero" style={{ backgroundImage: `url(${currentContent.hero.backgroundImage})` }}>
        <div className="hero-content">
          <h1 className="hero-title">{currentContent.hero.title}</h1>
          <p className="hero-subtitle">{currentContent.hero.subtitle}</p>

          {entityType === "firm" ? (
            <div className="hero-features grid md:grid-cols-3 gap-8 mt-12">
              {currentContent.hero.features.map((feature, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-6 text-center">
                    <img
                      src={feature.icon || "/placeholder.svg"}
                      alt={`${feature.title} icon`}
                      className="w-16 h-16 mx-auto mb-4 filter brightness-0 invert"
                    />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="mb-4 text-white/80">{feature.description}</p>
                    <Button
                      variant="outline"
                      onClick={() => scrollToSection(feature.buttonLink)}
                      className="border-white text-white hover:bg-white hover:text-black"
                    >
                      {feature.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="hero-features">
              <Button
                onClick={() => scrollToSection("#experience")}
                className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white text-lg px-8 py-3"
              >
                {currentContent.person.learnMoreButton}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About Section (only for firm) */}
      {entityType === "firm" && (
        <section id="about" className="py-20 bg-[var(--bg)] animate-section">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8">{currentContent.about.title}</h2>
            <hr className="w-1/2 mx-auto border-[var(--border)] mb-8" />
            <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">{currentContent.about.mission}</p>
            <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">{currentContent.about.values}</p>
            <Button
              onClick={() => scrollToSection(currentContent.about.buttonLink)}
              className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white"
            >
              {currentContent.about.buttonText}
            </Button>
          </div>
        </section>
      )}

      {/* Person Section (only for person) */}
      {entityType === "person" && (
        <section id="person" className="py-20 bg-[var(--bg)] animate-section">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <img
              src={currentContent.person.photo || "/placeholder.svg"}
              alt={currentContent.person.name}
              className="person-avatar mx-auto"
            />
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">{currentContent.person.name}</h1>
            <h2 className="text-xl text-[var(--text-secondary)] mb-6">{currentContent.person.title}</h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">{currentContent.person.bio}</p>
            <Button
              onClick={() => scrollToSection("#experience")}
              className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white"
            >
              {currentContent.person.experienceButton}
            </Button>
          </div>
        </section>
      )}

      {/* Experience Section (only for person) */}
      {entityType === "person" && (
        <section id="experience" className="py-20 bg-[var(--bg)] animate-section">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">
              {currentContent.person.experienceTitle}
            </h2>

            <div className="space-y-8 mb-12">
              {currentContent.person.experience.map((exp, index) => (
                <div
                  key={index}
                  className="experience-item animate-section staggered-animation"
                  style={{ "--index": index } as React.CSSProperties}
                >
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    {exp.dateRange}: {exp.role}
                  </h3>
                  <p className="text-[var(--text-secondary)]">{exp.details}</p>
                </div>
              ))}
            </div>

            <div className="animate-section">
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                {currentContent.person.highlightsTitle}
              </h3>
              <ul className="space-y-3">
                {currentContent.person.careerHighlights.map((highlight, index) => (
                  <li key={index} className="text-[var(--text-secondary)] flex items-start">
                    <span className="text-[var(--primary-color)] mr-2">•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Consultation Section */}
      <section id="consultation" className="py-20 bg-[var(--bg)] animate-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-4">
            {currentContent.consultation.title}
          </h2>
          <p className="text-xl text-[var(--text-secondary)] text-center mb-8">
            {currentContent.consultation.subtitle}
          </p>
          <img
            src={currentContent.consultation.icon || "/placeholder.svg"}
            alt="Consultation Icon"
            className="w-24 h-24 mx-auto mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <MapPin className="w-8 h-8 text-[var(--text-primary)] mb-2" />
              <p className="text-[var(--text-secondary)]">{currentContent.consultation.contactInfo.address}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Phone className="w-8 h-8 text-[var(--text-primary)] mb-2" />
              <a
                href={`tel:${currentContent.consultation.contactInfo.phone}`}
                className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                onClick={() => trackContactClick("phone")}
              >
                {currentContent.consultation.contactInfo.phone}
              </a>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="w-8 h-8 text-[var(--text-primary)] mb-2" />
              <p className="text-[var(--text-secondary)]">{currentContent.consultation.contactInfo.hours}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Mail className="w-8 h-8 text-[var(--text-primary)] mb-2" />
              <a
                href={`mailto:${currentContent.consultation.contactInfo.email}`}
                className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                onClick={() => trackContactClick("email")}
              >
                {currentContent.consultation.contactInfo.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-[var(--bg)] animate-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">
            {currentContent.services.title}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {currentContent.services.items.map((service, index) => (
              <Card
                key={index}
                className="bg-[var(--card-bg)] border-[var(--border)] animate-section staggered-animation"
                style={{ "--index": index } as React.CSSProperties}
              >
                <CardContent className="p-6">
                  <img
                    src={service.icon || "/placeholder.svg"}
                    alt={`${service.title} icon`}
                    className="w-12 h-12 mb-4"
                  />
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{service.title}</h3>
                  <p className="text-[var(--text-secondary)] mb-6">{service.description}</p>
                  <Button
                    onClick={() => scrollToSection(service.buttonLink)}
                    className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white"
                  >
                    {service.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section (only for firm) */}
      {entityType === "firm" && (
        <section id="team" className="py-20 bg-[var(--bg)] animate-section">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">
              {currentContent.team.title}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentContent.team.members.map((member, index) => (
                <Card
                  key={index}
                  className="bg-[var(--card-bg)] border-[var(--border)] text-center animate-section staggered-animation"
                  style={{ "--index": index } as React.CSSProperties}
                >
                  <CardContent className="p-6">
                    <img
                      src={member.photo || "/placeholder.svg"}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{member.name}</h3>
                    <p className="text-[var(--text-secondary)] mb-4 text-sm">{member.role}</p>
                    <Button
                      variant="outline"
                      onClick={() => trackPageClick("team")}
                      className="border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white"
                    >
                      {member.bioButton}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cases Section */}
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
                  <Button
                    variant="outline"
                    onClick={() => trackPageClick("cases")}
                    className="border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white"
                  >
                    {caseItem.detailsButton}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[var(--bg)] animate-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">
            {currentContent.contact.title}
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-[var(--card-bg)] border-[var(--border)] animate-section">
              <CardContent className="p-6">
                <form className="space-y-6">
                  {currentContent.contact.formFields.map((field, index) => (
                    <div key={index}>
                      <Label htmlFor={field.name} className="text-[var(--text-primary)]">
                        {field.label}
                      </Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          id={field.name}
                          name={field.name}
                          placeholder={field.placeholder}
                          className="bg-[var(--card-bg)] border-[var(--border)] text-[var(--text-primary)]"
                        />
                      ) : (
                        <Input
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          placeholder={field.placeholder}
                          className="bg-[var(--card-bg)] border-[var(--border)] text-[var(--text-primary)]"
                        />
                      )}
                    </div>
                  ))}
                  <Button
                    type="submit"
                    onClick={() => trackPageClick("contact")}
                    className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white"
                  >
                    {currentContent.contact.submitButtonText}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info and Map */}
            <div className="space-y-8 animate-section">
              <Card className="bg-[var(--card-bg)] border-[var(--border)]">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[var(--text-primary)]" />
                    <p className="text-[var(--text-secondary)]">{currentContent.contact.details.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[var(--text-primary)]" />
                    <a
                      href={`tel:${currentContent.contact.details.phone}`}
                      className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                      onClick={() => trackContactClick("phone")}
                    >
                      {currentContent.contact.details.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[var(--text-primary)]" />
                    <a
                      href={`mailto:${currentContent.contact.details.email}`}
                      className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                      onClick={() => trackContactClick("email")}
                    >
                      {currentContent.contact.details.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[var(--text-primary)]" />
                    <p className="text-[var(--text-secondary)]">{currentContent.contact.details.hours}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <div className="h-64 md:h-80 rounded-lg overflow-hidden">
                <iframe
                  src={currentContent.contact.location.embedMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
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

      {/* Footer */}
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
                value={currentLanguage}
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
    </div>
  )
}
