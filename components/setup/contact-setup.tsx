"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus } from "lucide-react"
import type { ContentData } from "@/types"

interface ContactSetupProps {
  currentContent: ContentData["content"]["es"]
  activeLanguage: string
  updateNestedValue: (path: string[], value: any) => void
  addArrayItem: (path: string[], template: any) => void
  removeArrayItem: (path: string[], index: number) => void
}

export const ContactSetup: React.FC<ContactSetupProps> = ({
  currentContent,
  activeLanguage,
  updateNestedValue,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
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
            onChange={(e) => updateNestedValue(["content", activeLanguage, "contact", "title"], e.target.value)}
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
                updateNestedValue(["content", activeLanguage, "contact", "details", "address"], e.target.value)
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
              updateNestedValue(["content", activeLanguage, "contact", "location", "embedMapUrl"], e.target.value)
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
                  onClick={() => removeArrayItem(["content", activeLanguage, "socialMedia", "networks"], index)}
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
  )
}
