"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WizardControlsProps {
  activeLanguage: string
  setActiveLanguage: (lang: string) => void
  saveStatus: string
}

export function WizardControls({ activeLanguage, setActiveLanguage, saveStatus }: WizardControlsProps) {
  return (
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
  )
}
