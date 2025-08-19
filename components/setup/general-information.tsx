"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Upload, ImageIcon } from "lucide-react"
import type { ContentData } from "@/types"

interface GeneralInformationProps {
  contentData: ContentData
  activeLanguage: string
  updateNestedValue: (path: string[], value: any) => void
  handleImageUpload: (path: string[], event: React.ChangeEvent<HTMLInputElement>) => void
  previewUrls: Record<string, string>
}

export const GeneralInformation: React.FC<GeneralInformationProps> = ({
  contentData,
  activeLanguage,
  updateNestedValue,
  handleImageUpload,
  previewUrls,
}) => {
  const currentContent = contentData.content[activeLanguage]

  return (
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
            placeholder={contentData.settings.entityType === "firm" ? "Nombre de tu bufete" : "Tu nombre completo"}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Subtítulo</Label>
          <Input
            value={currentContent.hero.subtitle}
            onChange={(e) => updateNestedValue(["content", activeLanguage, "hero", "subtitle"], e.target.value)}
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
                      "/placeholder.svg" ||
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
                  onChange={(e) => updateNestedValue(["content", activeLanguage, "about", "title"], e.target.value)}
                  placeholder="Ej: Bienvenido a Nuestro Bufete"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">Misión</Label>
                <Textarea
                  value={currentContent.about.mission}
                  onChange={(e) => updateNestedValue(["content", activeLanguage, "about", "mission"], e.target.value)}
                  placeholder="Describe la misión de tu bufete..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">Valores</Label>
                <Textarea
                  value={currentContent.about.values}
                  onChange={(e) => updateNestedValue(["content", activeLanguage, "about", "values"], e.target.value)}
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
                          "/placeholder.svg" ||
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
                  onChange={(e) => updateNestedValue(["content", activeLanguage, "person", "name"], e.target.value)}
                  placeholder="Ej: Juan Pérez, Esq."
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">Título profesional</Label>
                <Input
                  value={currentContent.person.title}
                  onChange={(e) => updateNestedValue(["content", activeLanguage, "person", "title"], e.target.value)}
                  placeholder="Ej: Abogado Especialista en Derecho Corporativo"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">Biografía</Label>
                <Textarea
                  value={currentContent.person.bio}
                  onChange={(e) => updateNestedValue(["content", activeLanguage, "person", "bio"], e.target.value)}
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
  )
}
