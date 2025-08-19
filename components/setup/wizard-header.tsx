import { Progress } from "@/components/ui/progress"

interface WizardHeaderProps {
  currentStep: number
  steps: string[]
}

export function WizardHeader({ currentStep, steps }: WizardHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración de tu Sitio Web Legal</h1>
      <p className="text-gray-600">Completa la información para personalizar tu sitio web</p>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Paso {currentStep + 1} de {steps.length}: {steps[currentStep]}
          </span>
          <span className="text-sm font-medium">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
      </div>
    </div>
  )
}
