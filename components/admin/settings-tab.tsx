"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { ContentData } from "@/types"

interface SettingsTabProps {
  contentData: ContentData
  updateNestedValue: (path: string[], value: any) => void
}

export function SettingsTab({ contentData, updateNestedValue }: SettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Theme</Label>
            <Select
              value={contentData.settings.theme}
              onValueChange={(v) => updateNestedValue(["settings", "theme"], v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Entity Type</Label>
            <Select
              value={contentData.settings.entityType}
              onValueChange={(v) => updateNestedValue(["settings", "entityType"], v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="firm">Law Firm</SelectItem>
                <SelectItem value="person">Individual Lawyer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={contentData.settings.enableDarkModeToggle}
            onCheckedChange={(c) => updateNestedValue(["settings", "enableDarkModeToggle"], c)}
          />
          <Label>Enable Dark Mode Toggle</Label>
        </div>
        <div>
          <Label>Default Language</Label>
          <Select
            value={contentData.settings.defaultLanguage}
            onValueChange={(v) => updateNestedValue(["settings", "defaultLanguage"], v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
