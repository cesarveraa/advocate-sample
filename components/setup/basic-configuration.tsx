"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import type { ContentData } from "@/types"

interface BasicConfigurationProps {
  contentData: ContentData
  updateNestedValue: (path: string[], value: any) => void
}

export const BasicConfiguration: React.FC<BasicConfigurationProps> = ({ contentData, updateNestedValue }) => {
  return (
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
          <Label htmlFor="dark-mode-toggle">Permitir que los usuarios cambien entre modo claro y oscuro</Label>
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
  )
}
