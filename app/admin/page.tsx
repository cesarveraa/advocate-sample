"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Trash2, Plus, Save, RefreshCw } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ContentData {
  settings: {
    theme: string
    enableDarkModeToggle: boolean
    defaultLanguage: string
    languages: string[]
    entityType: "firm" | "person"
  }
  styling: {
    light: Record<string, string>
    dark: Record<string, string>
    fontFamily: string
    fontSize: Record<string, string>
  }
  analytics: {
    visitorCount: number
    visitorLocations: string[]
    pageClicks: Record<string, number>
    contactClicks: Record<string, number>
  }
  content: {
    [key: string]: any
  }
}

interface Profile {
  code: string
  data: ContentData
  created_at: string
  updated_at: string
}

export default function AdminPanel() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [contentData, setContentData] = useState<ContentData | null>(null)
  const [activeLanguage, setActiveLanguage] = useState("es")
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState("")
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    setIsLoadingProfiles(true)
    try {
      const response = await fetch("http://localhost:8000/lawyers/")
      if (!response.ok) {
        throw new Error("Error al cargar los perfiles")
      }
      const profileList = await response.json()
      setProfiles(profileList)
      setLoading(false)
    } catch (error) {
      console.error("Error loading profiles:", error)
      setSaveStatus("Error al cargar los perfiles")
      setLoading(false)
    } finally {
      setIsLoadingProfiles(false)
    }
  }

  const loadProfile = async (code: string) => {
    try {
      const response = await fetch(`http://localhost:8000/lawyers/${code}`)
      if (!response.ok) {
        throw new Error("Error al cargar el perfil")
      }
      const { data } = await response.json()
      setContentData(data)
      setSelectedProfile(code)
      setActiveLanguage(data.settings.defaultLanguage)
    } catch (error) {
      console.error("Error loading profile:", error)
      setSaveStatus("Error al cargar el perfil")
    }
  }

  const updateNestedValue = (path: string[], value: any) => {
    if (!contentData) return

    const newData = JSON.parse(JSON.stringify(contentData))
    let current = newData

    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {}
      }
      current = current[path[i]]
    }

    current[path[path.length - 1]] = value
    setContentData(newData)
  }

  const addArrayItem = (path: string[], template: any) => {
    if (!contentData) return

    const newData = JSON.parse(JSON.stringify(contentData))
    let current = newData

    for (const key of path) {
      current = current[key]
    }

    if (Array.isArray(current)) {
      current.push(JSON.parse(JSON.stringify(template)))
    }

    setContentData(newData)
  }

  const removeArrayItem = (path: string[], index: number) => {
    if (!contentData) return

    const newData = JSON.parse(JSON.stringify(contentData))
    let current = newData

    for (const key of path) {
      current = current[key]
    }

    if (Array.isArray(current)) {
      current.splice(index, 1)
    }

    setContentData(newData)
  }

  const saveContent = async () => {
    if (!contentData || !selectedProfile) return

    setIsSaving(true)
    setSaveStatus("Guardando...")

    try {
      const response = await fetch(`http://localhost:8000/lawyers/${selectedProfile}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: contentData }),
      })

      if (!response.ok) {
        throw new Error("Error al guardar el perfil")
      }

      setSaveStatus("Guardado con éxito!")
      setTimeout(() => setSaveStatus(""), 3000)
    } catch (error) {
      console.error("Error saving content:", error)
      setSaveStatus("Error al guardar!")
      setTimeout(() => setSaveStatus(""), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const currentContent = contentData?.content[activeLanguage]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Panel de Administración</h1>

          <div className="flex gap-4 items-center mb-4">
            <Button
              onClick={saveContent}
              disabled={!selectedProfile || isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>

            <Button onClick={loadProfiles} disabled={isLoadingProfiles} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingProfiles ? "animate-spin" : ""}`} />
              Actualizar Lista
            </Button>

            {saveStatus && (
              <span className={`text-sm ${saveStatus.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                {saveStatus}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-1">
              <Label>Seleccionar Perfil:</Label>
              <Select value={selectedProfile || ""} onValueChange={loadProfile}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un perfil" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.code} value={profile.code}>
                      {profile.data.content.es?.header?.logoText || profile.code} ({profile.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {contentData && (
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
            )}
          </div>

          {profiles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No hay perfiles creados aún.</p>
              <Button onClick={() => (window.location.href = "/setup")}>Crear primer perfil</Button>
            </div>
          )}
        </div>

        {contentData && currentContent && (
          <Tabs defaultValue="settings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="styling">Styling</TabsTrigger>
              <TabsTrigger value="header">Header</TabsTrigger>
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            {/* Settings Tab */}
            <TabsContent value="settings">
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
                        onValueChange={(value) => updateNestedValue(["settings", "theme"], value)}
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
                        onValueChange={(value) => updateNestedValue(["settings", "entityType"], value)}
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
                      onCheckedChange={(checked) => updateNestedValue(["settings", "enableDarkModeToggle"], checked)}
                    />
                    <Label>Enable Dark Mode Toggle</Label>
                  </div>

                  <div>
                    <Label>Default Language</Label>
                    <Select
                      value={contentData.settings.defaultLanguage}
                      onValueChange={(value) => updateNestedValue(["settings", "defaultLanguage"], value)}
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
            </TabsContent>

            {/* Styling Tab */}
            <TabsContent value="styling">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Light Theme Colors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(contentData.styling.light).map(([key, value]) => (
                        <div key={key}>
                          <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                          <Input
                            type="color"
                            value={value}
                            onChange={(e) => updateNestedValue(["styling", "light", key], e.target.value)}
                            className="h-10"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dark Theme Colors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(contentData.styling.dark).map(([key, value]) => (
                        <div key={key}>
                          <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                          <Input
                            type="color"
                            value={value}
                            onChange={(e) => updateNestedValue(["styling", "dark", key], e.target.value)}
                            className="h-10"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Typography</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Font Family</Label>
                        <Input
                          value={contentData.styling.fontFamily}
                          onChange={(e) => updateNestedValue(["styling", "fontFamily"], e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(contentData.styling.fontSize).map(([key, value]) => (
                          <div key={key}>
                            <Label className="capitalize">{key}</Label>
                            <Input
                              value={value}
                              onChange={(e) => updateNestedValue(["styling", "fontSize", key], e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Header Tab */}
            <TabsContent value="header">
              <Card>
                <CardHeader>
                  <CardTitle>Header Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Logo Text</Label>
                    <Input
                      value={currentContent.header.logoText}
                      onChange={(e) =>
                        updateNestedValue(["content", activeLanguage, "header", "logoText"], e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Menu Items</Label>
                    {currentContent.header.menuItems.map((item: any, index: number) => (
                      <div key={index} className="flex gap-2 items-center mt-2">
                        <Input
                          placeholder="Label"
                          value={item.label}
                          onChange={(e) =>
                            updateNestedValue(
                              ["content", activeLanguage, "header", "menuItems", index, "label"],
                              e.target.value,
                            )
                          }
                        />
                        <Input
                          placeholder="Anchor"
                          value={item.anchor}
                          onChange={(e) =>
                            updateNestedValue(
                              ["content", activeLanguage, "header", "menuItems", index, "anchor"],
                              e.target.value,
                            )
                          }
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeArrayItem(["content", activeLanguage, "header", "menuItems"], index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        addArrayItem(["content", activeLanguage, "header", "menuItems"], { label: "", anchor: "" })
                      }
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Menu Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hero Tab */}
            <TabsContent value="hero">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Background Image URL</Label>
                    <Input
                      value={currentContent.hero.backgroundImage}
                      onChange={(e) =>
                        updateNestedValue(["content", activeLanguage, "hero", "backgroundImage"], e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input
                      value={currentContent.hero.title}
                      onChange={(e) => updateNestedValue(["content", activeLanguage, "hero", "title"], e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Subtitle</Label>
                    <Input
                      value={currentContent.hero.subtitle}
                      onChange={(e) =>
                        updateNestedValue(["content", activeLanguage, "hero", "subtitle"], e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Features</Label>
                    {currentContent.hero.features.map((feature: any, index: number) => (
                      <Collapsible key={index} className="mt-4">
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            Feature {index + 1}: {feature.title}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 mt-2 p-4 border rounded">
                          <Input
                            placeholder="Icon URL"
                            value={feature.icon}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "hero", "features", index, "icon"],
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Title"
                            value={feature.title}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "hero", "features", index, "title"],
                                e.target.value,
                              )
                            }
                          />
                          <Textarea
                            placeholder="Description"
                            value={feature.description}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "hero", "features", index, "description"],
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Button Text"
                            value={feature.buttonText}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "hero", "features", index, "buttonText"],
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Button Link"
                            value={feature.buttonLink}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "hero", "features", index, "buttonLink"],
                                e.target.value,
                              )
                            }
                          />
                          <Button
                            variant="destructive"
                            onClick={() => removeArrayItem(["content", activeLanguage, "hero", "features"], index)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Feature
                          </Button>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                    <Button
                      onClick={() =>
                        addArrayItem(["content", activeLanguage, "hero", "features"], {
                          icon: "",
                          title: "",
                          description: "",
                          buttonText: "",
                          buttonLink: "",
                        })
                      }
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={currentContent.about.title}
                      onChange={(e) => updateNestedValue(["content", activeLanguage, "about", "title"], e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Mission</Label>
                    <Textarea
                      value={currentContent.about.mission}
                      onChange={(e) =>
                        updateNestedValue(["content", activeLanguage, "about", "mission"], e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Values</Label>
                    <Textarea
                      value={currentContent.about.values}
                      onChange={(e) =>
                        updateNestedValue(["content", activeLanguage, "about", "values"], e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Button Text</Label>
                    <Input
                      value={currentContent.about.buttonText}
                      onChange={(e) =>
                        updateNestedValue(["content", activeLanguage, "about", "buttonText"], e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Button Link</Label>
                    <Input
                      value={currentContent.about.buttonLink}
                      onChange={(e) =>
                        updateNestedValue(["content", activeLanguage, "about", "buttonLink"], e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Person Section */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Person Section (Individual Lawyer)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Photo URL</Label>
                    <Input
                      value={currentContent.person.photo}
                      onChange={(e) =>
                        updateNestedValue(["content", activeLanguage, "person", "photo"], e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Name</Label>
                    <Input
                      value={currentContent.person.name}
                      onChange={(e) => updateNestedValue(["content", activeLanguage, "person", "name"], e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input
                      value={currentContent.person.title}
                      onChange={(e) =>
                        updateNestedValue(["content", activeLanguage, "person", "title"], e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Bio</Label>
                    <Textarea
                      value={currentContent.person.bio}
                      onChange={(e) => updateNestedValue(["content", activeLanguage, "person", "bio"], e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Experience</Label>
                    {currentContent.person.experience.map((exp: any, index: number) => (
                      <div key={index} className="border p-4 rounded mt-2">
                        <Input
                          placeholder="Date Range"
                          value={exp.dateRange}
                          onChange={(e) =>
                            updateNestedValue(
                              ["content", activeLanguage, "person", "experience", index, "dateRange"],
                              e.target.value,
                            )
                          }
                          className="mb-2"
                        />
                        <Input
                          placeholder="Role"
                          value={exp.role}
                          onChange={(e) =>
                            updateNestedValue(
                              ["content", activeLanguage, "person", "experience", index, "role"],
                              e.target.value,
                            )
                          }
                          className="mb-2"
                        />
                        <Textarea
                          placeholder="Details"
                          value={exp.details}
                          onChange={(e) =>
                            updateNestedValue(
                              ["content", activeLanguage, "person", "experience", index, "details"],
                              e.target.value,
                            )
                          }
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeArrayItem(["content", activeLanguage, "person", "experience"], index)}
                          className="mt-2"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
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
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>

                  <div>
                    <Label>Career Highlights</Label>
                    {currentContent.person.careerHighlights.map((highlight: string, index: number) => (
                      <div key={index} className="flex gap-2 items-center mt-2">
                        <Input
                          value={highlight}
                          onChange={(e) =>
                            updateNestedValue(
                              ["content", activeLanguage, "person", "careerHighlights", index],
                              e.target.value,
                            )
                          }
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            removeArrayItem(["content", activeLanguage, "person", "careerHighlights"], index)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => addArrayItem(["content", activeLanguage, "person", "careerHighlights"], "")}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Highlight
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Services Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={currentContent.services.title}
                      onChange={(e) =>
                        updateNestedValue(["content", activeLanguage, "services", "title"], e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Services</Label>
                    {currentContent.services.items.map((service: any, index: number) => (
                      <Collapsible key={index} className="mt-4">
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            Service {index + 1}: {service.title}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 mt-2 p-4 border rounded">
                          <Input
                            placeholder="Icon URL"
                            value={service.icon}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "services", "items", index, "icon"],
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Title"
                            value={service.title}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "services", "items", index, "title"],
                                e.target.value,
                              )
                            }
                          />
                          <Textarea
                            placeholder="Description"
                            value={service.description}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "services", "items", index, "description"],
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Button Text"
                            value={service.buttonText}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "services", "items", index, "buttonText"],
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Button Link"
                            value={service.buttonLink}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "services", "items", index, "buttonLink"],
                                e.target.value,
                              )
                            }
                          />
                          <Button
                            variant="destructive"
                            onClick={() => removeArrayItem(["content", activeLanguage, "services", "items"], index)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Service
                          </Button>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                    <Button
                      onClick={() =>
                        addArrayItem(["content", activeLanguage, "services", "items"], {
                          icon: "",
                          title: "",
                          description: "",
                          buttonText: "",
                          buttonLink: "",
                        })
                      }
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={currentContent.team.title}
                      onChange={(e) => updateNestedValue(["content", activeLanguage, "team", "title"], e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Team Members</Label>
                    {currentContent.team.members.map((member: any, index: number) => (
                      <Collapsible key={index} className="mt-4">
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            Member {index + 1}: {member.name}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 mt-2 p-4 border rounded">
                          <Input
                            placeholder="Photo URL"
                            value={member.photo}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "team", "members", index, "photo"],
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Name"
                            value={member.name}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "team", "members", index, "name"],
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Role"
                            value={member.role}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "team", "members", index, "role"],
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Bio Link"
                            value={member.bioLink}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "team", "members", index, "bioLink"],
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Bio Button Text"
                            value={member.bioButton}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "team", "members", index, "bioButton"],
                                e.target.value,
                              )
                            }
                          />
                          <Button
                            variant="destructive"
                            onClick={() => removeArrayItem(["content", activeLanguage, "team", "members"], index)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Member
                          </Button>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                    <Button
                      onClick={() =>
                        addArrayItem(["content", activeLanguage, "team", "members"], {
                          photo: "",
                          name: "",
                          role: "",
                          bioLink: "",
                          bioButton: "",
                        })
                      }
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Team Member
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={currentContent.contact.title}
                        onChange={(e) =>
                          updateNestedValue(["content", activeLanguage, "contact", "title"], e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Submit Button Text</Label>
                      <Input
                        value={currentContent.contact.submitButtonText}
                        onChange={(e) =>
                          updateNestedValue(["content", activeLanguage, "contact", "submitButtonText"], e.target.value)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Address</Label>
                      <Input
                        value={currentContent.contact.details.address}
                        onChange={(e) =>
                          updateNestedValue(
                            ["content", activeLanguage, "contact", "details", "address"],
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={currentContent.contact.details.phone}
                        onChange={(e) =>
                          updateNestedValue(["content", activeLanguage, "contact", "details", "phone"], e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input
                        value={currentContent.contact.details.email}
                        onChange={(e) =>
                          updateNestedValue(["content", activeLanguage, "contact", "details", "email"], e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Hours</Label>
                      <Input
                        value={currentContent.contact.details.hours}
                        onChange={(e) =>
                          updateNestedValue(["content", activeLanguage, "contact", "details", "hours"], e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Map Embed URL</Label>
                      <Textarea
                        value={currentContent.contact.location.embedMapUrl}
                        onChange={(e) =>
                          updateNestedValue(
                            ["content", activeLanguage, "contact", "location", "embedMapUrl"],
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Form Fields</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentContent.contact.formFields.map((field: any, index: number) => (
                      <div key={index} className="border p-4 rounded mt-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Label"
                            value={field.label}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "contact", "formFields", index, "label"],
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Type"
                            value={field.type}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "contact", "formFields", index, "type"],
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Name"
                            value={field.name}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "contact", "formFields", index, "name"],
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="Placeholder"
                            value={field.placeholder}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "contact", "formFields", index, "placeholder"],
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeArrayItem(["content", activeLanguage, "contact", "formFields"], index)}
                          className="mt-2"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Field
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        addArrayItem(["content", activeLanguage, "contact", "formFields"], {
                          label: "",
                          type: "text",
                          name: "",
                          placeholder: "",
                        })
                      }
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Form Field
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!selectedProfile && profiles.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Selecciona un perfil para comenzar a editar</p>
          </div>
        )}
      </div>
    </div>
  )
}
