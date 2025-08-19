"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import type { ContentData } from "@/types"

interface FinishStepProps {
  contentData: ContentData
  currentContent: any
  onCreateProfile: () => void
  isSubmitting: boolean
}

export function FinishStep({ contentData, currentContent, onCreateProfile, isSubmitting }: FinishStepProps) {
  return (
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
          <li>• Tipo: {contentData.settings.entityType === "firm" ? "Bufete Legal" : "Abogado Individual"}</li>
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
        <Button onClick={onCreateProfile} disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creando perfil...
            </>
          ) : (
            "Crear mi perfil"
          )}
        </Button>

        <p className="text-sm text-gray-500">Se creará tu perfil y serás redirigido a tu sitio web personalizado.</p>
      </div>
    </div>
  )
}
