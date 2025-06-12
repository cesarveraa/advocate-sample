"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Check, ChevronLeft, ChevronRight, Upload, ImageIcon, Trash2, Plus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { nanoid } from 'nanoid/non-secure'

interface ContentData {
  settings: {
    theme: string
    enableDarkModeToggle: boolean
    defaultLanguage: string
    languages: string[]
    entityType: "firm" | "person"
  }
  styling: {
    light: Record<string, string>
    dark: Record<string, string>
    fontFamily: string
    fontSize: Record<string, string>
  }
  analytics: {
    visitorCount: number
    visitorLocations: string[]
    pageClicks: Record<string, number>
    contactClicks: Record<string, number>
  }
  content: {
    [key: string]: any
  }
}

const defaultContent: ContentData = {
  settings: {
    theme: "dark",
    enableDarkModeToggle: true,
    defaultLanguage: "es",
    languages: ["es", "en"],
    entityType: "firm",
  },
  styling: {
    light: {
      primaryColor: "#C59D5F",
      secondaryColor: "#8B7355",
      backgroundColor: "#ffffff",
      textPrimary: "#1a1a1a",
      textSecondary: "#4a4a4a",
      borderColor: "#d0d0d0",
      cardBackground: "#ffffff",
      footerBackground: "#1a1a1a",
      footerText: "#ffffff",
    },
    dark: {
      primaryColor: "#C59D5F",
      secondaryColor: "#8B7355",
      backgroundColor: "#1a1a1a",
      textPrimary: "#f5f5f5",
      textSecondary: "#cccccc",
      borderColor: "#444444",
      cardBackground: "#2a2a2a",
      footerBackground: "#000000",
      footerText: "#f5f5f5",
    },
    fontFamily: "Montserrat",
    fontSize: {
      small: "0.875rem",
      base: "1rem",
      large: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
  },
  analytics: {
    visitorCount: 0,
    visitorLocations: [],
    pageClicks: {
      hero: 0,
      services: 0,
      team: 0,
      cases: 0,
      contact: 0,
      experience: 0,
    },
    contactClicks: {
      whatsapp: 0,
      email: 0,
      phone: 0,
    },
  },
  content: {
    es: {
      header: {
        logoText: "Mi Bufete Legal",
        menuItems: [
          { label: "Inicio", anchor: "#hero" },
          { label: "Servicios", anchor: "#services" },
          { label: "Equipo", anchor: "#team" },
          { label: "Experiencia", anchor: "#experience" },
          { label: "Casos", anchor: "#cases" },
          { label: "Contacto", anchor: "#contact" },
        ],
      },
      hero: {
        backgroundImage: "/placeholder.svg?height=1080&width=1920",
        title: "Mi Bufete Legal",
        subtitle: "FIRMA DE ABOGADOS ESPECIALIZADA",
        features: [
          {
            icon: "/placeholder.svg?height=60&width=60",
            title: "Derecho Empresarial",
            description: "Asesoría en derecho corporativo y transacciones comerciales.",
            buttonText: "Conoce más",
            buttonLink: "#services",
          },
          {
            icon: "/placeholder.svg?height=60&width=60",
            title: "Litigios",
            description: "Defensa en tribunales y resolución de disputas.",
            buttonText: "Conoce más",
            buttonLink: "#services",
          },
          {
            icon: "/placeholder.svg?height=60&width=60",
            title: "Bienes Raíces",
            description: "Operaciones inmobiliarias y cierres.",
            buttonText: "Conoce más",
            buttonLink: "#services",
          },
        ],
      },
      about: {
        title: "Bienvenido a Mi Bufete Legal",
        mission:
          "Cuando se trata de eventos importantes que pueden requerir un abogado, nuestro equipo está aquí para brindar la representación legal experta que necesita.",
        values:
          "Nos enfocamos en nuestros clientes y manejamos cada caso con integridad y respeto, asegurándonos de que reciba la atención personalizada que merece.",
        buttonText: "Conoce más",
        buttonLink: "#services",
      },
      person: {
        photo: "/placeholder.svg?height=200&width=200",
        name: "Juan Pérez, Esq.",
        title: "Abogado Independiente",
        bio: "Con más de 15 años de experiencia, Juan Pérez se especializa en derecho corporativo y litigios comerciales, brindando servicios legales de alta calidad a clientes individuales y empresariales.",
        experience: [
          {
            dateRange: "2010–2015",
            role: "Asociado Junior en Firma XYZ",
            details: "Participó en juicios civiles y asesoró a pequeñas empresas en contratos.",
          },
          {
            dateRange: "2015–2020",
            role: "Socio en Firma ABC",
            details: "Dirigió el departamento de litigios y obtuvo veredictos exitosos en casos de alto perfil.",
          },
          {
            dateRange: "2020–Presente",
            role: "Abogado Independiente",
            details: "Presta servicios a clientes en transacciones inmobiliarias, fusiones y adquisiciones.",
          },
        ],
        careerHighlights: [
          "Certificación en Derecho Corporativo – Universidad de La Paz, 2009",
          "Magíster en Derecho Comercial – Universidad Católica Boliviana, 2014",
          'Premio al "Mejor Litigante Joven" – Asociación de Abogados de Bolivia, 2016',
        ],
        experienceTitle: "Experiencia Profesional",
        highlightsTitle: "Highlights de Carrera",
        experienceButton: "Ver Experiencia",
        learnMoreButton: "Conoce más de mí",
      },
      consultation: {
        title: "¿NECESITAS UN ABOGADO?",
        subtitle: "Programa una Consulta",
        icon: "/placeholder.svg?height=100&width=100",
        contactInfo: {
          address: "123 Main St, Ciudad",
          phone: "+1 (555) 123-4567",
          hours: "Lun–Vie: 9am – 5pm",
          email: "info@mibufete.com",
        },
      },
      services: {
        title: "Áreas de Práctica",
        items: [
          {
            icon: "/placeholder.svg?height=50&width=50",
            title: "Derecho Inmobiliario y Cierres",
            description: "Asesoría completa en transacciones inmobiliarias.",
            buttonText: "Programa tu consulta",
            buttonLink: "#contact",
          },
          {
            icon: "/placeholder.svg?height=50&width=50",
            title: "Derecho Corporativo y Formación de Entidades",
            description: "Creación y estructuración de empresas.",
            buttonText: "Programa tu consulta",
            buttonLink: "#contact",
          },
          {
            icon: "/placeholder.svg?height=50&width=50",
            title: "Resolución de Disputas y Litigios",
            description: "Representación legal en litigios y mediaciones.",
            buttonText: "Programa tu consulta",
            buttonLink: "#contact",
          },
        ],
      },
      team: {
        title: "Nuestro Equipo",
        members: [
          {
            photo: "/placeholder.svg?height=150&width=150",
            name: "Carlos Rodríguez",
            role: "Abogado Principal",
            bioLink: "#",
            bioButton: "Ver Bio",
          },
          {
            photo: "/placeholder.svg?height=150&width=150",
            name: "Ana Martínez",
            role: "Abogada Asociada",
            bioLink: "#",
            bioButton: "Ver Bio",
          },
        ],
      },
      cases: {
        title: "Casos de Éxito",
        items: [
          {
            caseTitle: "Victoria en caso de litigio comercial 2024",
            description: "Obtuvimos un fallo favorable en disputa de $2M.",
            detailsLink: "#",
            detailsButton: "Detalles",
          },
          {
            caseTitle: "Cierre exitoso de transacción inmobiliaria 2023",
            description: "Asesoramos en la venta de complejo residencial.",
            detailsLink: "#",
            detailsButton: "Detalles",
          },
        ],
      },
      contact: {
        title: "Contáctanos",
        formFields: [
          { label: "Nombre", type: "text", name: "name", placeholder: "Tu nombre" },
          { label: "Correo", type: "email", name: "email", placeholder: "Tu correo" },
          { label: "Teléfono", type: "tel", name: "phone", placeholder: "Tu teléfono" },
          { label: "Asunto", type: "text", name: "subject", placeholder: "Asunto" },
          { label: "Mensaje", type: "textarea", name: "message", placeholder: "Tu mensaje" },
        ],
        submitButtonText: "Enviar",
        location: {
          embedMapUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3519.8!2d-82.4572!3d27.9506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDU3JzAyLjIiTiA4MsKwMjcnMjYuMCJX!5e0!3m2!1sen!2sus!4v1234567890",
        },
        details: {
          address: "123 Main St, Ciudad",
          phone: "+1 (555) 123-4567",
          email: "info@mibufete.com",
          hours: "Lun–Vie: 9am – 5pm",
        },
      },
      footer: {
        quickLinks: [
          { label: "Inicio", anchor: "#hero" },
          { label: "Áreas de Práctica", anchor: "#services" },
          { label: "Contacto", anchor: "#contact" },
        ],
        resources: [
          { label: "Política de Privacidad", url: "/privacy" },
          { label: "Aviso Legal", url: "/disclaimer" },
        ],
        languageSelector: "Idioma",
        copyright: "© 2025 Mi Bufete Legal | Todos los derechos reservados",
      },
      socialMedia: {
        title: "Síguenos en redes sociales",
        networks: [
          { name: "Facebook", url: "https://facebook.com/mibufete", icon: "facebook" },
          { name: "Twitter", url: "https://twitter.com/mibufete", icon: "twitter" },
          { name: "LinkedIn", url: "https://linkedin.com/company/mibufete", icon: "linkedin" },
        ],
        contactButton: "Contáctanos ahora",
        contactText: "¿Tienes alguna pregunta? Estamos aquí para ayudarte.",
      },
      ui: {
        entityToggle: {
          firmLabel: "Firma",
          personLabel: "Abogado",
          switchToFirm: "Cambiar a Firma",
          switchToPerson: "Cambiar a Abogado",
        },
      },
    },
    en: {
      header: {
        logoText: "My Law Firm",
        menuItems: [
          { label: "Home", anchor: "#hero" },
          { label: "Services", anchor: "#services" },
          { label: "Team", anchor: "#team" },
          { label: "Experience", anchor: "#experience" },
          { label: "Cases", anchor: "#cases" },
          { label: "Contact", anchor: "#contact" },
        ],
      },
      hero: {
        backgroundImage: "/placeholder.svg?height=1080&width=1920",
        title: "My Law Firm",
        subtitle: "SPECIALIZED LAW FIRM",
        features: [
          {
            icon: "/placeholder.svg?height=60&width=60",
            title: "Business Law",
            description: "Corporate law advisory and commercial transactions.",
            buttonText: "Learn more",
            buttonLink: "#services",
          },
          {
            icon: "/placeholder.svg?height=60&width=60",
            title: "Litigation",
            description: "Court defense and dispute resolution.",
            buttonText: "Learn more",
            buttonLink: "#services",
          },
          {
            icon: "/placeholder.svg?height=60&width=60",
            title: "Real Estate",
            description: "Real estate operations and closings.",
            buttonText: "Learn more",
            buttonLink: "#services",
          },
        ],
      },
      about: {
        title: "Welcome to My Law Firm",
        mission:
          "When it comes to important events that may require a lawyer, our team is here to provide the expert legal representation you need.",
        values:
          "We focus on our clients and handle each case with integrity and respect, ensuring you receive the personalized attention you deserve.",
        buttonText: "Learn more",
        buttonLink: "#services",
      },
      person: {
        photo: "/placeholder.svg?height=200&width=200",
        name: "John Doe, Esq.",
        title: "Independent Attorney",
        bio: "With over 15 years of experience, John Doe specializes in corporate law and commercial litigation, providing high-quality legal services to individual and business clients.",
        experience: [
          {
            dateRange: "2010–2015",
            role: "Junior Associate at XYZ Firm",
            details: "Participated in civil trials and advised small businesses on contracts.",
          },
          {
            dateRange: "2015–2020",
            role: "Partner at ABC Firm",
            details: "Led the litigation department and obtained successful verdicts in high-profile cases.",
          },
          {
            dateRange: "2020–Present",
            role: "Independent Attorney",
            details: "Provides services to clients in real estate transactions, mergers and acquisitions.",
          },
        ],
        careerHighlights: [
          "Corporate Law Certification – University of La Paz, 2009",
          "Master's in Commercial Law – Universidad Católica Boliviana, 2014",
          '"Best Young Litigator" Award – Bolivia Bar Association, 2016',
        ],
        experienceTitle: "Professional Experience",
        highlightsTitle: "Career Highlights",
        experienceButton: "View Experience",
        learnMoreButton: "Learn more about me",
      },
      consultation: {
        title: "NEED A LAWYER?",
        subtitle: "Schedule a Consultation",
        icon: "/placeholder.svg?height=100&width=100",
        contactInfo: {
          address: "123 Main St, City",
          phone: "+1 (555) 123-4567",
          hours: "Mon–Fri: 9am – 5pm",
          email: "info@mylawfirm.com",
        },
      },
      services: {
        title: "Practice Areas",
        items: [
          {
            icon: "/placeholder.svg?height=50&width=50",
            title: "Real Estate Law & Closings",
            description: "Complete advisory on real estate transactions.",
            buttonText: "Schedule consultation",
            buttonLink: "#contact",
          },
          {
            icon: "/placeholder.svg?height=50&width=50",
            title: "Corporate Law & Business Entity Formation",
            description: "Business creation and structuring.",
            buttonText: "Schedule consultation",
            buttonLink: "#contact",
          },
          {
            icon: "/placeholder.svg?height=50&width=50",
            title: "Dispute Resolution & Litigation",
            description: "Legal representation in litigation and mediation.",
            buttonText: "Schedule consultation",
            buttonLink: "#contact",
          },
        ],
      },
      team: {
        title: "Our Team",
        members: [
          {
            photo: "/placeholder.svg?height=150&width=150",
            name: "Charles Rodriguez",
            role: "Lead Attorney",
            bioLink: "#",
            bioButton: "View Bio",
          },
          {
            photo: "/placeholder.svg?height=150&width=150",
            name: "Anna Martinez",
            role: "Associate Attorney",
            bioLink: "#",
            bioButton: "View Bio",
          },
        ],
      },
      cases: {
        title: "Success Stories",
        items: [
          {
            caseTitle: "Victory in commercial litigation case 2024",
            description: "We obtained a favorable ruling in a $2M dispute.",
            detailsLink: "#",
            detailsButton: "Details",
          },
          {
            caseTitle: "Successful real estate transaction closing 2023",
            description: "We advised on the sale of a residential complex.",
            detailsLink: "#",
            detailsButton: "Details",
          },
        ],
      },
      contact: {
        title: "Contact Us",
        formFields: [
          { label: "Name", type: "text", name: "name", placeholder: "Your name" },
          { label: "Email", type: "email", name: "email", placeholder: "Your email" },
          { label: "Phone", type: "tel", name: "phone", placeholder: "Your phone" },
          { label: "Subject", type: "text", name: "subject", placeholder: "Subject" },
          { label: "Message", type: "textarea", name: "message", placeholder: "Your message" },
        ],
        submitButtonText: "Send",
        location: {
          embedMapUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3519.8!2d-82.4572!3d27.9506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDU3JzAyLjIiTiA4MsKwMjcnMjYuMCJX!5e0!3m2!1sen!2sus!4v1234567890",
        },
        details: {
          address: "123 Main St, City",
          phone: "+1 (555) 123-4567",
          email: "info@mylawfirm.com",
          hours: "Mon–Fri: 9am – 5pm",
        },
      },
      footer: {
        quickLinks: [
          { label: "Home", anchor: "#hero" },
          { label: "Practice Areas", anchor: "#services" },
          { label: "Contact", anchor: "#contact" },
        ],
        resources: [
          { label: "Privacy Policy", url: "/privacy" },
          { label: "Disclaimer", url: "/disclaimer" },
        ],
        languageSelector: "Language",
        copyright: "© 2025 My Law Firm | All rights reserved",
      },
      socialMedia: {
        title: "Follow us on social media",
        networks: [
          { name: "Facebook", url: "https://facebook.com/mylawfirm", icon: "facebook" },
          { name: "Twitter", url: "https://twitter.com/mylawfirm", icon: "twitter" },
          { name: "LinkedIn", url: "https://linkedin.com/company/mylawfirm", icon: "linkedin" },
        ],
        contactButton: "Contact us now",
        contactText: "Have any questions? We're here to help.",
      },
      ui: {
        entityToggle: {
          firmLabel: "Firm",
          personLabel: "Lawyer",
          switchToFirm: "Switch to Firm",
          switchToPerson: "Switch to Lawyer",
        },
      },
    },
  },
}

const steps = [
  "Configuración Básica",
  "Información General",
  "Servicios",
  "Equipo",
  "Casos de Éxito",
  "Contacto",
  "Finalizar",
]

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [contentData, setContentData] = useState<ContentData>(defaultContent)
  const [activeLanguage, setActiveLanguage] = useState("es")
  const [saveStatus, setSaveStatus] = useState("")
  const [imageUploads, setImageUploads] = useState<Record<string, File | null>>({})
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const handleImageUpload = (path: string[], event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file)
    setPreviewUrls((prev) => ({ ...prev, [path.join(".")]: previewUrl }))

    // Store the file for later processing
    setImageUploads((prev) => ({ ...prev, [path.join(".")]: file }))

    // Update the path in the content data with a placeholder that will be replaced
    // In a real app, you would upload this to a server and get a URL back
    updateNestedValue(path, previewUrl)
  }

  const updateNestedValue = (path: string[], value: any) => {
    const newData = JSON.parse(JSON.stringify(contentData))
    let current = newData

    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {}
      }
      current = current[path[i]]
    }

    current[path[path.length - 1]] = value
    setContentData(newData)
  }

  const addArrayItem = (path: string[], template: any) => {
    const newData = JSON.parse(JSON.stringify(contentData))
    let current = newData

    for (const key of path) {
      current = current[key]
    }

    if (Array.isArray(current)) {
      current.push(JSON.parse(JSON.stringify(template)))
    }

    setContentData(newData)
  }

  const removeArrayItem = (path: string[], index: number) => {
    const newData = JSON.parse(JSON.stringify(contentData))
    let current = newData

    for (const key of path) {
      current = current[key]
    }

    if (Array.isArray(current)) {
      current.splice(index, 1)
    }

    setContentData(newData)
  }

  const createProfile = async () => {
  setIsSubmitting(true)
  setSaveStatus("Creando perfil...")

  // 1) Construye tu payload aquí para imprimírtelo
  const payload = {
    code: nanoid(8),       // genera un código de 8 caracteres
    data: contentData,
  }
  console.log("▶️ Payload enviado a /lawyers/:", payload)

  try {
    const response = await fetch("http://localhost:8000/lawyers/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    console.log("🔔 Status HTTP:", response.status, response.statusText)
    const text = await response.text()
    console.log("📝 Body raw de la respuesta:", text)

    if (!response.ok) {
      // 2) Intenta parsear JSON de error (si viene JSON)
      let errJson: any
      try { errJson = JSON.parse(text) } catch {}
      console.error("❌ Error details from server:", errJson)
      throw new Error("Error al crear el perfil")
    }

    const profile = JSON.parse(text)
    console.log("✅ Perfil creado:", profile)
    setSaveStatus("¡Perfil creado con éxito!")

    setTimeout(() => {
      router.push(`/?code=${profile.code}`)
    }, 1500)
  } catch (error) {
    console.error("🚨 Exception en createProfile:", error)
    setSaveStatus("Error al crear el perfil. Inténtalo de nuevo.")
    setIsSubmitting(false)
  }
}


  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const currentContent = contentData.content[activeLanguage]

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración de tu Sitio Web Legal</h1>
          <p className="text-gray-600">Completa la información para personalizar tu sitio web</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Paso {currentStep + 1} de {steps.length}: {steps[currentStep]}
            </span>
            <span className="text-sm font-medium">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Label>Idioma:</Label>
            <Select value={activeLanguage} onValueChange={setActiveLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {saveStatus && (
            <span className={`text-sm font-medium ${saveStatus.includes("Error") ? "text-red-600" : "text-green-600"}`}>
              {saveStatus}
            </span>
          )}
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            {/* Step 1: Basic Configuration */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Configuración Básica</h2>
                  <p className="text-gray-600 mb-6">Configura los ajustes básicos de tu sitio web</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base">¿Qué tipo de sitio web necesitas?</Label>
                    <RadioGroup
                      value={contentData.settings.entityType}
                      onValueChange={(value: "firm" | "person") => updateNestedValue(["settings", "entityType"], value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="firm" id="firm" />
                        <Label htmlFor="firm">Bufete o Firma Legal (múltiples abogados)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="person" id="person" />
                        <Label htmlFor="person">Abogado Individual</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base">Tema del sitio web</Label>
                    <RadioGroup
                      value={contentData.settings.theme}
                      onValueChange={(value) => updateNestedValue(["settings", "theme"], value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light">Claro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark">Oscuro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auto" id="auto" />
                        <Label htmlFor="auto">Automático (basado en preferencias del usuario)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={contentData.settings.enableDarkModeToggle}
                      onCheckedChange={(checked) => updateNestedValue(["settings", "enableDarkModeToggle"], checked)}
                      id="dark-mode-toggle"
                    />
                    <Label htmlFor="dark-mode-toggle">
                      Permitir que los usuarios cambien entre modo claro y oscuro
                    </Label>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base">Colores principales</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label>Color primario</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={contentData.styling.light.primaryColor}
                            onChange={(e) => {
                              updateNestedValue(["styling", "light", "primaryColor"], e.target.value)
                              updateNestedValue(["styling", "dark", "primaryColor"], e.target.value)
                            }}
                            className="w-16 h-10"
                          />
                          <span className="text-sm">{contentData.styling.light.primaryColor}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Color secundario</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={contentData.styling.light.secondaryColor}
                            onChange={(e) => {
                              updateNestedValue(["styling", "light", "secondaryColor"], e.target.value)
                              updateNestedValue(["styling", "dark", "secondaryColor"], e.target.value)
                            }}
                            className="w-16 h-10"
                          />
                          <span className="text-sm">{contentData.styling.light.secondaryColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base">Tipografía</Label>
                    <Select
                      value={contentData.styling.fontFamily}
                      onValueChange={(value) => updateNestedValue(["styling", "fontFamily"], value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open+Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Playfair+Display">Playfair Display</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: General Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Información General</h2>
                  <p className="text-gray-600 mb-6">
                    Ingresa la información principal de tu{" "}
                    {contentData.settings.entityType === "firm" ? "bufete" : "perfil profesional"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Nombre del {contentData.settings.entityType === "firm" ? "Bufete" : "Abogado"}</Label>
                    <Input
                      value={currentContent.header.logoText}
                      onChange={(e) => {
                        updateNestedValue(["content", activeLanguage, "header", "logoText"], e.target.value)
                        updateNestedValue(["content", activeLanguage, "hero", "title"], e.target.value)
                      }}
                      placeholder={
                        contentData.settings.entityType === "firm" ? "Nombre de tu bufete" : "Tu nombre completo"
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Subtítulo</Label>
                    <Input
                      value={currentContent.hero.subtitle}
                      onChange={(e) =>
                        updateNestedValue(["content", activeLanguage, "hero", "subtitle"], e.target.value)
                      }
                      placeholder="Ej: BUFETE ESPECIALIZADO EN DERECHO CORPORATIVO"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Imagen de Portada</Label>
                    <div className="mt-1 flex items-center gap-4">
                      <div className="relative">
                        <div className="border rounded-md overflow-hidden w-32 h-20 bg-gray-100 flex items-center justify-center">
                          {previewUrls[["content", activeLanguage, "hero", "backgroundImage"].join(".")] ||
                          currentContent.hero.backgroundImage ? (
                            <img
                              src={
                                previewUrls[["content", activeLanguage, "hero", "backgroundImage"].join(".")] ||
                                currentContent.hero.backgroundImage ||
                                "/placeholder.svg"
                              }
                              alt="Portada"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          id="hero-image"
                          className="hidden"
                          onChange={(e) => handleImageUpload(["content", activeLanguage, "hero", "backgroundImage"], e)}
                        />
                        <Label
                          htmlFor="hero-image"
                          className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Subir imagen
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">Recomendado: 1920x1080px</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {contentData.settings.entityType === "firm" ? (
                    <div>
                      <Label>Sobre Nosotros</Label>
                      <div className="space-y-4 mt-2">
                        <div>
                          <Label className="text-sm text-gray-600">Título</Label>
                          <Input
                            value={currentContent.about.title}
                            onChange={(e) =>
                              updateNestedValue(["content", activeLanguage, "about", "title"], e.target.value)
                            }
                            placeholder="Ej: Bienvenido a Nuestro Bufete"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Misión</Label>
                          <Textarea
                            value={currentContent.about.mission}
                            onChange={(e) =>
                              updateNestedValue(["content", activeLanguage, "about", "mission"], e.target.value)
                            }
                            placeholder="Describe la misión de tu bufete..."
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Valores</Label>
                          <Textarea
                            value={currentContent.about.values}
                            onChange={(e) =>
                              updateNestedValue(["content", activeLanguage, "about", "values"], e.target.value)
                            }
                            placeholder="Describe los valores de tu bufete..."
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Label>Información Personal</Label>
                      <div className="space-y-4 mt-2">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="border rounded-full overflow-hidden w-24 h-24 bg-gray-100 flex items-center justify-center">
                              {previewUrls[["content", activeLanguage, "person", "photo"].join(".")] ||
                              currentContent.person.photo ? (
                                <img
                                  src={
                                    previewUrls[["content", activeLanguage, "person", "photo"].join(".")] ||
                                    currentContent.person.photo ||
                                    "/placeholder.svg"
                                  }
                                  alt="Foto de perfil"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              id="person-photo"
                              className="hidden"
                              onChange={(e) => handleImageUpload(["content", activeLanguage, "person", "photo"], e)}
                            />
                            <Label
                              htmlFor="person-photo"
                              className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Subir foto
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">Recomendado: 400x400px</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Nombre completo</Label>
                          <Input
                            value={currentContent.person.name}
                            onChange={(e) =>
                              updateNestedValue(["content", activeLanguage, "person", "name"], e.target.value)
                            }
                            placeholder="Ej: Juan Pérez, Esq."
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Título profesional</Label>
                          <Input
                            value={currentContent.person.title}
                            onChange={(e) =>
                              updateNestedValue(["content", activeLanguage, "person", "title"], e.target.value)
                            }
                            placeholder="Ej: Abogado Especialista en Derecho Corporativo"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Biografía</Label>
                          <Textarea
                            value={currentContent.person.bio}
                            onChange={(e) =>
                              updateNestedValue(["content", activeLanguage, "person", "bio"], e.target.value)
                            }
                            placeholder="Describe tu experiencia profesional y especialidades..."
                            className="mt-1"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Services */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Servicios</h2>
                  <p className="text-gray-600 mb-6">Define las áreas de práctica o servicios que ofreces</p>
                </div>

                <div>
                  <Label>Título de la sección</Label>
                  <Input
                    value={currentContent.services.title}
                    onChange={(e) =>
                      updateNestedValue(["content", activeLanguage, "services", "title"], e.target.value)
                    }
                    placeholder="Ej: Áreas de Práctica"
                    className="mt-1"
                  />
                </div>

                <div className="space-y-6 mt-4">
                  <Label>Servicios</Label>

                  {currentContent.services.items.map((service: any, index: number) => (
                    <div key={index} className="border rounded-md p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Servicio {index + 1}</h3>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeArrayItem(["content", activeLanguage, "services", "items"], index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Título</Label>
                          <Input
                            value={service.title}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "services", "items", index, "title"],
                                e.target.value,
                              )
                            }
                            placeholder="Ej: Derecho Corporativo"
                            className="mt-1"
                          />
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="border rounded-md overflow-hidden w-12 h-12 bg-gray-100 flex items-center justify-center">
                              {previewUrls[["content", activeLanguage, "services", "items", index, "icon"].join(".")] ||
                              service.icon ? (
                                <img
                                  src={
                                    previewUrls[
                                      ["content", activeLanguage, "services", "items", index, "icon"].join(".")
                                    ] || service.icon
                                  }
                                  alt="Icono"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              id={`service-icon-${index}`}
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(["content", activeLanguage, "services", "items", index, "icon"], e)
                              }
                            />
                            <Label
                              htmlFor={`service-icon-${index}`}
                              className="cursor-pointer inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                            >
                              <Upload className="w-3 h-3 mr-1" />
                              Icono
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">Descripción</Label>
                        <Textarea
                          value={service.description}
                          onChange={(e) =>
                            updateNestedValue(
                              ["content", activeLanguage, "services", "items", index, "description"],
                              e.target.value,
                            )
                          }
                          placeholder="Describe este servicio..."
                          className="mt-1"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Texto del botón</Label>
                          <Input
                            value={service.buttonText}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "services", "items", index, "buttonText"],
                                e.target.value,
                              )
                            }
                            placeholder="Ej: Consultar"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Enlace del botón</Label>
                          <Input
                            value={service.buttonLink}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "services", "items", index, "buttonLink"],
                                e.target.value,
                              )
                            }
                            placeholder="Ej: #contact"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={() =>
                      addArrayItem(["content", activeLanguage, "services", "items"], {
                        icon: "/placeholder.svg?height=50&width=50",
                        title: "",
                        description: "",
                        buttonText: activeLanguage === "es" ? "Consultar" : "Inquire",
                        buttonLink: "#contact",
                      })
                    }
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Servicio
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Team */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Equipo</h2>
                  <p className="text-gray-600 mb-6">
                    {contentData.settings.entityType === "firm"
                      ? "Agrega los miembros de tu equipo legal"
                      : "Agrega tu experiencia profesional"}
                  </p>
                </div>

                {contentData.settings.entityType === "firm" ? (
                  <div className="space-y-6">
                    <div>
                      <Label>Título de la sección</Label>
                      <Input
                        value={currentContent.team.title}
                        onChange={(e) =>
                          updateNestedValue(["content", activeLanguage, "team", "title"], e.target.value)
                        }
                        placeholder="Ej: Nuestro Equipo"
                        className="mt-1"
                      />
                    </div>

                    <div className="space-y-6">
                      <Label>Miembros del equipo</Label>

                      {currentContent.team.members.map((member: any, index: number) => (
                        <div key={index} className="border rounded-md p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Miembro {index + 1}</h3>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeArrayItem(["content", activeLanguage, "team", "members"], index)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </Button>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="border rounded-full overflow-hidden w-20 h-20 bg-gray-100 flex items-center justify-center">
                                {previewUrls[
                                  ["content", activeLanguage, "team", "members", index, "photo"].join(".")
                                ] || member.photo ? (
                                  <img
                                    src={
                                      previewUrls[
                                        ["content", activeLanguage, "team", "members", index, "photo"].join(".")
                                      ] || member.photo
                                    }
                                    alt="Foto"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                            </div>
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                id={`team-photo-${index}`}
                                className="hidden"
                                onChange={(e) =>
                                  handleImageUpload(["content", activeLanguage, "team", "members", index, "photo"], e)
                                }
                              />
                              <Label
                                htmlFor={`team-photo-${index}`}
                                className="cursor-pointer inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                              >
                                <Upload className="w-3 h-3 mr-1" />
                                Subir foto
                              </Label>
                              <p className="text-xs text-gray-500 mt-1">Recomendado: 300x300px</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm text-gray-600">Nombre</Label>
                              <Input
                                value={member.name}
                                onChange={(e) =>
                                  updateNestedValue(
                                    ["content", activeLanguage, "team", "members", index, "name"],
                                    e.target.value,
                                  )
                                }
                                placeholder="Ej: Juan Pérez"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-sm text-gray-600">Cargo</Label>
                              <Input
                                value={member.role}
                                onChange={(e) =>
                                  updateNestedValue(
                                    ["content", activeLanguage, "team", "members", index, "role"],
                                    e.target.value,
                                  )
                                }
                                placeholder="Ej: Abogado Senior"
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm text-gray-600">Texto del botón</Label>
                              <Input
                                value={member.bioButton}
                                onChange={(e) =>
                                  updateNestedValue(
                                    ["content", activeLanguage, "team", "members", index, "bioButton"],
                                    e.target.value,
                                  )
                                }
                                placeholder="Ej: Ver Bio"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-sm text-gray-600">Enlace de biografía</Label>
                              <Input
                                value={member.bioLink}
                                onChange={(e) =>
                                  updateNestedValue(
                                    ["content", activeLanguage, "team", "members", index, "bioLink"],
                                    e.target.value,
                                  )
                                }
                                placeholder="Ej: #"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        onClick={() =>
                          addArrayItem(["content", activeLanguage, "team", "members"], {
                            photo: "/placeholder.svg?height=150&width=150",
                            name: "",
                            role: "",
                            bioLink: "#",
                            bioButton: activeLanguage === "es" ? "Ver Bio" : "View Bio",
                          })
                        }
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Miembro
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <Label>Título de la sección</Label>
                      <Input
                        value={currentContent.person.experienceTitle}
                        onChange={(e) =>
                          updateNestedValue(["content", activeLanguage, "person", "experienceTitle"], e.target.value)
                        }
                        placeholder="Ej: Experiencia Profesional"
                        className="mt-1"
                      />
                    </div>

                    <div className="space-y-6">
                      <Label>Experiencia profesional</Label>

                      {currentContent.person.experience.map((exp: any, index: number) => (
                        <div key={index} className="border rounded-md p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Experiencia {index + 1}</h3>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                removeArrayItem(["content", activeLanguage, "person", "experience"], index)
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm text-gray-600">Período</Label>
                              <Input
                                value={exp.dateRange}
                                onChange={(e) =>
                                  updateNestedValue(
                                    ["content", activeLanguage, "person", "experience", index, "dateRange"],
                                    e.target.value,
                                  )
                                }
                                placeholder="Ej: 2015-2020"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-sm text-gray-600">Cargo</Label>
                              <Input
                                value={exp.role}
                                onChange={(e) =>
                                  updateNestedValue(
                                    ["content", activeLanguage, "person", "experience", index, "role"],
                                    e.target.value,
                                  )
                                }
                                placeholder="Ej: Abogado Senior en Firma XYZ"
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm text-gray-600">Detalles</Label>
                            <Textarea
                              value={exp.details}
                              onChange={(e) =>
                                updateNestedValue(
                                  ["content", activeLanguage, "person", "experience", index, "details"],
                                  e.target.value,
                                )
                              }
                              placeholder="Describe tus responsabilidades y logros..."
                              className="mt-1"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}

                      <Button
                        onClick={() =>
                          addArrayItem(["content", activeLanguage, "person", "experience"], {
                            dateRange: "",
                            role: "",
                            details: "",
                          })
                        }
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Experiencia
                      </Button>
                    </div>

                    <div className="space-y-4 mt-6">
                      <div>
                        <Label>Título de logros</Label>
                        <Input
                          value={currentContent.person.highlightsTitle}
                          onChange={(e) =>
                            updateNestedValue(["content", activeLanguage, "person", "highlightsTitle"], e.target.value)
                          }
                          placeholder="Ej: Logros Destacados"
                          className="mt-1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Logros destacados</Label>

                        {currentContent.person.careerHighlights.map((highlight: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={highlight}
                              onChange={(e) =>
                                updateNestedValue(
                                  ["content", activeLanguage, "person", "careerHighlights", index],
                                  e.target.value,
                                )
                              }
                              placeholder="Ej: Certificación en Derecho Corporativo"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() =>
                                removeArrayItem(["content", activeLanguage, "person", "careerHighlights"], index)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          onClick={() => addArrayItem(["content", activeLanguage, "person", "careerHighlights"], "")}
                          size="sm"
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Logro
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Success Cases */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Casos de Éxito</h2>
                  <p className="text-gray-600 mb-6">Comparte tus casos exitosos para mostrar tu experiencia</p>
                </div>

                <div>
                  <Label>Título de la sección</Label>
                  <Input
                    value={currentContent.cases.title}
                    onChange={(e) => updateNestedValue(["content", activeLanguage, "cases", "title"], e.target.value)}
                    placeholder="Ej: Casos de Éxito"
                    className="mt-1"
                  />
                </div>

                <div className="space-y-6 mt-4">
                  <Label>Casos</Label>

                  {currentContent.cases.items.map((caseItem: any, index: number) => (
                    <div key={index} className="border rounded-md p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Caso {index + 1}</h3>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeArrayItem(["content", activeLanguage, "cases", "items"], index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">Título del caso</Label>
                        <Input
                          value={caseItem.caseTitle}
                          onChange={(e) =>
                            updateNestedValue(
                              ["content", activeLanguage, "cases", "items", index, "caseTitle"],
                              e.target.value,
                            )
                          }
                          placeholder="Ej: Victoria en caso de litigio comercial 2024"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">Descripción</Label>
                        <Textarea
                          value={caseItem.description}
                          onChange={(e) =>
                            updateNestedValue(
                              ["content", activeLanguage, "cases", "items", index, "description"],
                              e.target.value,
                            )
                          }
                          placeholder="Describe brevemente el caso y su resultado..."
                          className="mt-1"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Texto del botón</Label>
                          <Input
                            value={caseItem.detailsButton}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "cases", "items", index, "detailsButton"],
                                e.target.value,
                              )
                            }
                            placeholder="Ej: Detalles"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Enlace a detalles</Label>
                          <Input
                            value={caseItem.detailsLink}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "cases", "items", index, "detailsLink"],
                                e.target.value,
                              )
                            }
                            placeholder="Ej: #"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={() =>
                      addArrayItem(["content", activeLanguage, "cases", "items"], {
                        caseTitle: "",
                        description: "",
                        detailsLink: "#",
                        detailsButton: activeLanguage === "es" ? "Detalles" : "Details",
                      })
                    }
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Caso
                  </Button>
                </div>
              </div>
            )}

            {/* Step 6: Contact */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Información de Contacto</h2>
                  <p className="text-gray-600 mb-6">Configura la información de contacto y ubicación</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Título de la sección</Label>
                    <Input
                      value={currentContent.contact.title}
                      onChange={(e) =>
                        updateNestedValue(["content", activeLanguage, "contact", "title"], e.target.value)
                      }
                      placeholder="Ej: Contáctanos"
                      className="mt-1"
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Dirección</Label>
                      <Input
                        value={currentContent.contact.details.address}
                        onChange={(e) =>
                          updateNestedValue(
                            ["content", activeLanguage, "contact", "details", "address"],
                            e.target.value,
                          )
                        }
                        placeholder="Ej: Av. Principal 123, Ciudad"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Teléfono</Label>
                      <Input
                        value={currentContent.contact.details.phone}
                        onChange={(e) =>
                          updateNestedValue(["content", activeLanguage, "contact", "details", "phone"], e.target.value)
                        }
                        placeholder="Ej: +1 (555) 123-4567"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={currentContent.contact.details.email}
                        onChange={(e) =>
                          updateNestedValue(["content", activeLanguage, "contact", "details", "email"], e.target.value)
                        }
                        placeholder="Ej: info@mibufete.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Horarios</Label>
                      <Input
                        value={currentContent.contact.details.hours}
                        onChange={(e) =>
                          updateNestedValue(["content", activeLanguage, "contact", "details", "hours"], e.target.value)
                        }
                        placeholder="Ej: Lun–Vie: 9am – 5pm"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>URL del mapa de Google Maps (embed)</Label>
                    <Textarea
                      value={currentContent.contact.location.embedMapUrl}
                      onChange={(e) =>
                        updateNestedValue(
                          ["content", activeLanguage, "contact", "location", "embedMapUrl"],
                          e.target.value,
                        )
                      }
                      placeholder="Pega aquí la URL de embed de Google Maps..."
                      className="mt-1"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ve a Google Maps, busca tu dirección, haz clic en "Compartir" → "Insertar un mapa" y copia la URL
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <Label>Texto del botón de envío</Label>
                    <Input
                      value={currentContent.contact.submitButtonText}
                      onChange={(e) =>
                        updateNestedValue(["content", activeLanguage, "contact", "submitButtonText"], e.target.value)
                      }
                      placeholder="Ej: Enviar mensaje"
                      className="mt-1"
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label>Redes sociales</Label>
                    <div className="space-y-4 mt-2">
                      {currentContent.socialMedia.networks.map((network: any, index: number) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-20">
                            <Label className="text-sm text-gray-600 capitalize">{network.name}</Label>
                          </div>
                          <Input
                            value={network.url}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "socialMedia", "networks", index, "url"],
                                e.target.value,
                              )
                            }
                            placeholder={`URL de ${network.name}`}
                            className="flex-1"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() =>
                              removeArrayItem(["content", activeLanguage, "socialMedia", "networks"], index)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        onClick={() =>
                          addArrayItem(["content", activeLanguage, "socialMedia", "networks"], {
                            name: "Instagram",
                            url: "",
                            icon: "instagram",
                          })
                        }
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Red Social
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Finish */}
            {currentStep === 6 && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">¡Configuración Completada!</h2>
                  <p className="text-gray-600 mb-6">
                    Has completado la configuración de tu sitio web legal. Ahora crearemos tu perfil.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-left">
                  <h3 className="font-semibold mb-4">Resumen de tu configuración:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      • Tipo: {contentData.settings.entityType === "firm" ? "Bufete Legal" : "Abogado Individual"}
                    </li>
                    <li>• Nombre: {currentContent.header.logoText}</li>
                    <li>• Servicios: {currentContent.services.items.length} configurados</li>
                    <li>
                      • {contentData.settings.entityType === "firm" ? "Miembros del equipo" : "Experiencias"}:{" "}
                      {contentData.settings.entityType === "firm"
                        ? currentContent.team.members.length
                        : currentContent.person.experience.length}{" "}
                      configurados
                    </li>
                    <li>• Casos de éxito: {currentContent.cases.items.length} configurados</li>
                    <li>• Idiomas: {contentData.settings.languages.join(", ")}</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={createProfile}
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creando perfil...
                      </>
                    ) : (
                      "Crear mi perfil"
                    )}
                  </Button>

                  <p className="text-sm text-gray-500">
                    Se creará tu perfil y serás redirigido a tu sitio web personalizado.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="text-sm text-gray-500">
            {currentStep + 1} de {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep}>
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={createProfile} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                "Crear Perfil"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

