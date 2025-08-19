"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, Upload, ImageIcon } from "lucide-react"
import type { ContentData } from "@/types"

interface TeamSetupProps {
  contentData: ContentData
  currentContent: ContentData["content"]["es"]
  activeLanguage: string
  updateNestedValue: (path: string[], value: any) => void
  addArrayItem: (path: string[], template: any) => void
  removeArrayItem: (path: string[], index: number) => void
  handleImageUpload: (path: string[], event: React.ChangeEvent<HTMLInputElement>) => void
  previewUrls: Record<string, string>
}

export const TeamSetup: React.FC<TeamSetupProps> = ({
  contentData,
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
              onChange={(e) => updateNestedValue(["content", activeLanguage, "team", "title"], e.target.value)}
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
                      {previewUrls[["content", activeLanguage, "team", "members", index, "photo"].join(".")] ||
                      member.photo ? (
                        <img
                          src={
                            previewUrls[["content", activeLanguage, "team", "members", index, "photo"].join(".")] ||
                            member.photo ||
                            "/placeholder.svg"
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
                        updateNestedValue(["content", activeLanguage, "team", "members", index, "name"], e.target.value)
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
                        updateNestedValue(["content", activeLanguage, "team", "members", index, "role"], e.target.value)
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
                    onClick={() => removeArrayItem(["content", activeLanguage, "person", "experience"], index)}
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
                    onClick={() => removeArrayItem(["content", activeLanguage, "person", "careerHighlights"], index)}
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
  )
}
