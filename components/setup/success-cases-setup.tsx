"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus } from "lucide-react"
import type { ContentData } from "@/types"

interface SuccessCasesSetupProps {
  currentContent: ContentData["content"]["es"]
  activeLanguage: string
  updateNestedValue: (path: string[], value: any) => void
  addArrayItem: (path: string[], template: any) => void
  removeArrayItem: (path: string[], index: number) => void
}

export const SuccessCasesSetup: React.FC<SuccessCasesSetupProps> = ({
  currentContent,
  activeLanguage,
  updateNestedValue,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
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
                  updateNestedValue(["content", activeLanguage, "cases", "items", index, "caseTitle"], e.target.value)
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
                  updateNestedValue(["content", activeLanguage, "cases", "items", index, "description"], e.target.value)
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
  )
}
