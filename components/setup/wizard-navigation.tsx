"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface WizardNavigationProps {
  currentStep: number
  totalSteps: number
  prevStep: () => void
  nextStep: () => void
  onCreateProfile: () => void
  isSubmitting: boolean
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  prevStep,
  nextStep,
  onCreateProfile,
  isSubmitting,
}: WizardNavigationProps) {
  return (
    <div className="flex justify-between items-center">
      <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Anterior
      </Button>

      <div className="text-sm text-gray-500">
        {currentStep + 1} de {totalSteps}
      </div>

      {currentStep < totalSteps - 1 ? (
        <Button onClick={nextStep}>
          Siguiente
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button onClick={onCreateProfile} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
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
  )
}
