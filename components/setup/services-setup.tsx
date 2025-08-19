"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, Upload, ImageIcon } from "lucide-react"
import type { ContentData } from "@/types"

interface ServicesSetupProps {
  currentContent: ContentData["content"]["es"]
  activeLanguage: string
  updateNestedValue: (path: string[], value: any) => void
  addArrayItem: (path: string[], template: any) => void
  removeArrayItem: (path: string[], index: number) => void
  handleImageUpload: (path: string[], event: React.ChangeEvent<HTMLInputElement>) => void
  previewUrls: Record<string, string>
}

export const ServicesSetup: React.FC<ServicesSetupProps> = ({
  currentContent,
  activeLanguage,
  updateNestedValue,
  addArrayItem,
  removeArrayItem,
  handleImageUpload,
  previewUrls,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Servicios</h2>
        <p className="text-gray-600 mb-6">Define las áreas de práctica o servicios que ofreces</p>
      </div>

      <div>
        <Label>Título de la sección</Label>
        <Input
          value={currentContent.services.title}
          onChange={(e) => updateNestedValue(["content", activeLanguage, "services", "title"], e.target.value)}
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
                    updateNestedValue(["content", activeLanguage, "services", "items", index, "title"], e.target.value)
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
                          previewUrls[["content", activeLanguage, "services", "items", index, "icon"].join(".")] ||
                          service.icon ||
                          "/placeholder.svg"
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
  )
}
