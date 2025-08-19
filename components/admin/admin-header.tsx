"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Save } from "lucide-react"

interface AdminHeaderProps {
  activeLanguage: string
  setActiveLanguage: (lang: string) => void
  saveStatus: string
  isSaving: boolean
  onSave: () => void
  onReload: () => void
  onLogout: () => void
  hasContent: boolean
}

export function AdminHeader({
  activeLanguage,
  setActiveLanguage,
  saveStatus,
  isSaving,
  onSave,
  onReload,
  onLogout,
  hasContent,
}: AdminHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onReload}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Recargar
          </Button>
          <Button variant="destructive" onClick={onLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center mb-4">
        <Button onClick={onSave} disabled={!hasContent || isSaving} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </Button>

        {saveStatus && (
          <span className={`text-sm ${saveStatus.includes("Error") ? "text-red-600" : "text-green-600"}`}>
            {saveStatus}
          </span>
        )}
      </div>

      {hasContent && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="lg:col-span-1">
            <Label>Idioma:</Label>
            <Select value={activeLanguage} onValueChange={setActiveLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
