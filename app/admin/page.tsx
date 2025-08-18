"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Save, RefreshCw } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// ─────────────────────────────────────────────────────────────
// ENV
// ─────────────────────────────────────────────────────────────
const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL!;
const ADV_API = process.env.NEXT_PUBLIC_ADVOCATE_API_URL!;

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────
interface ContentData {
  settings: {
    theme: string;
    enableDarkModeToggle: boolean;
    defaultLanguage: string;
    languages: string[];
    entityType: "firm" | "person";
  };
  styling: {
    light: Record<string, string>;
    dark: Record<string, string>;
    fontFamily: string;
    fontSize: Record<string, string>;
  };
  analytics: {
    visitorCount: number;
    visitorLocations: string[];
    pageClicks: Record<string, number>;
    contactClicks: Record<string, number>;
  };
  content: { [key: string]: any };
}

// ─────────────────────────────────────────────────────────────
// Esqueleto por defecto (para evitar undefineds en el UI)
// ─────────────────────────────────────────────────────────────
const DEFAULT_DATA: ContentData = {
  settings: {
    theme: "light",
    enableDarkModeToggle: true,
    defaultLanguage: "es",
    languages: ["es", "en"],
    entityType: "person",
  },
  styling: {
    light: { primary: "#0ea5e9", secondary: "#0369a1", background: "#ffffff", text: "#0f172a" },
    dark: { primary: "#38bdf8", secondary: "#0ea5e9", background: "#0b1220", text: "#e2e8f0" },
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: { h1: "2.25rem", h2: "1.875rem", body: "1rem", small: "0.875rem" },
  },
  analytics: {
    visitorCount: 0,
    visitorLocations: [],
    pageClicks: {},
    contactClicks: {},
  },
  content: {
    es: {
      header: { logoText: "", menuItems: [] },
      hero: { backgroundImage: "", title: "", subtitle: "", features: [] },
      about: { title: "", mission: "", values: "", buttonText: "", buttonLink: "" },
      person: { photo: "", name: "", title: "", bio: "", experience: [], careerHighlights: [] },
      services: { title: "", items: [] },
      team: { title: "", members: [] },
      contact: {
        title: "",
        submitButtonText: "",
        details: { address: "", phone: "", email: "", hours: "" },
        location: { embedMapUrl: "" },
        formFields: [],
      },
    },
    en: {
      header: { logoText: "", menuItems: [] },
      hero: { backgroundImage: "", title: "", subtitle: "", features: [] },
      about: { title: "", mission: "", values: "", buttonText: "", buttonLink: "" },
      person: { photo: "", name: "", title: "", bio: "", experience: [], careerHighlights: [] },
      services: { title: "", items: [] },
      team: { title: "", members: [] },
      contact: {
        title: "",
        submitButtonText: "",
        details: { address: "", phone: "", email: "", hours: "" },
        location: { embedMapUrl: "" },
        formFields: [],
      },
    },
  },
};

// Toma lo que venga del backend y completa con DEFAULT_DATA para evitar undefineds.
function ensureSkeleton(raw: any): ContentData {
  const base = JSON.parse(JSON.stringify(DEFAULT_DATA)) as ContentData;
  const src = (raw?.data ? raw.data : raw) || {};
  function merge(target: any, from: any) {
    Object.keys(from || {}).forEach((k) => {
      if (from[k] && typeof from[k] === "object" && !Array.isArray(from[k])) {
        if (!target[k]) target[k] = {};
        merge(target[k], from[k]);
      } else {
        target[k] = from[k];
      }
    });
  }
  merge(base, src);
  return base;
}

export default function AdminPanel() {
  // ─────────────────────────────────────────────────────────────
  // Sesión
  // ─────────────────────────────────────────────────────────────
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────
  // Edición
  // ─────────────────────────────────────────────────────────────
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [activeLanguage, setActiveLanguage] = useState("es");
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // Bootstrap: rehidratar token si ya habías iniciado sesión
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const stored = typeof window !== "undefined" ? localStorage.getItem("idToken") : null;
      if (stored) {
        setIdToken(stored);
        setIsLoggedIn(true);
        try {
          await loadMyPage(stored); // ← SIEMPRE con token
        } catch (e) {
          console.error(e);
        } finally {
          setIsAuthChecked(true);
          setLoading(false);
        }
        return;
      }
      // No token guardado: mostrar pantalla de login
      setIsAuthChecked(true);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─────────────────────────────────────────────────────────────
  // API helpers
  // ─────────────────────────────────────────────────────────────
  async function loadMyPage(tokenOverride?: string) {
    const t = tokenOverride ?? idToken;
    if (!t) throw new Error("No hay idToken para llamar al API de abogados");

    // 1) Intento leer mi página
    let res = await fetch(`${ADV_API}/auth/users/me/lawyer`, {
      method: "GET",
      headers: { Authorization: `Bearer ${t}` },
    });

    // 2) Si no existe, crearla
    if (res.status === 404) {
      res = await fetch(`${ADV_API}/auth/users/me/lawyer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify({ data: {} }),
      });
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`No se pudo cargar tu página (${res.status}): ${txt}`);
    }

    const page = await res.json();
    setContentData(ensureSkeleton(page));
    setIsLoggedIn(true);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await fetch(`${AUTH_API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // para cookie httpOnly en el dominio del Auth API
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Login falló (${res.status}): ${t}`);
      }
      const json = await res.json();
      if (!json.idToken) throw new Error("El server de Auth no devolvió idToken");

      // Guardar token y estado
      setIdToken(json.idToken);
      localStorage.setItem("idToken", json.idToken);
      setIsLoggedIn(true);

      // Ahora sí, cargar/crear mi página
      await loadMyPage(json.idToken);
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || "Error al iniciar sesión");
    } finally {
      setLoginLoading(false);
    }
  }

  const handleLogout = async () => {
    try {
      await fetch(`${AUTH_API}/auth/logout`, { method: "POST", credentials: "include" });
    } catch {
      // noop
    }
    localStorage.removeItem("idToken");
    setIdToken(null);
    setIsLoggedIn(false);
    setContentData(null);
    setLoginEmail("");
    setLoginPassword("");
  };

  // ─────────────────────────────────────────────────────────────
  // Utilidades de edición
  // ─────────────────────────────────────────────────────────────
  const updateNestedValue = (path: string[], value: any) => {
    if (!contentData) return;
    const newData = JSON.parse(JSON.stringify(contentData));
    let current = newData as any;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setContentData(newData);
  };

  const addArrayItem = (path: string[], template: any) => {
    if (!contentData) return;
    const newData = JSON.parse(JSON.stringify(contentData));
    let current = newData as any;
    for (const key of path) current = current[key];
    if (Array.isArray(current)) current.push(JSON.parse(JSON.stringify(template)));
    setContentData(newData);
  };

  const removeArrayItem = (path: string[], index: number) => {
    if (!contentData) return;
    const newData = JSON.parse(JSON.stringify(contentData));
    let current = newData as any;
    for (const key of path) current = current[key];
    if (Array.isArray(current)) current.splice(index, 1);
    setContentData(newData);
  };

  const saveContent = async () => {
    if (!contentData || !idToken) return;
    setIsSaving(true);
    setSaveStatus("Guardando...");
    try {
      const res = await fetch(`${ADV_API}/auth/users/me/lawyer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ data: contentData }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Error al guardar (${res.status}): ${text}`);
      }
      setSaveStatus("¡Guardado con éxito!");
    } catch (e) {
      console.error(e);
      setSaveStatus("¡Error al guardar!");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  if (!isAuthChecked || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Vista de LOGIN (si no hay sesión)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Inicia sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && <p className="text-sm text-red-600">{loginError}</p>}
              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentContent = contentData?.content?.[activeLanguage];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => idToken && loadMyPage()}
                disabled={!idToken}
                title={!idToken ? "Inicia sesión para recargar" : "Recargar"}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recargar
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </div>
          </div>

          <div className="flex gap-4 items-center mb-4">
            <Button
              onClick={saveContent}
              disabled={!contentData || isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>

            {saveStatus && (
              <span className={`text-sm ${saveStatus.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                {saveStatus}
              </span>
            )}
          </div>

          {contentData && (
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

        {!contentData && (
          <div className="text-center py-12">
            <p className="text-gray-600">No tienes una página vinculada todavía.</p>
          </div>
        )}

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

            {/* ------- Settings ------- */}
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
            </TabsContent>

            {/* ------- Styling ------- */}
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

            {/* ------- Header ------- */}
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
                              e.target.value
                            )
                          }
                        />
                        <Input
                          placeholder="Anchor"
                          value={item.anchor}
                          onChange={(e) =>
                            updateNestedValue(
                              ["content", activeLanguage, "header", "menuItems", index, "anchor"],
                              e.target.value
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
                      <Plus className="w-4 h-4 mr-2" /> Add Menu Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ------- Hero ------- */}
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
                              updateNestedValue(["content", activeLanguage, "hero", "features", index, "icon"], e.target.value)
                            }
                          />
                          <Input
                            placeholder="Title"
                            value={feature.title}
                            onChange={(e) =>
                              updateNestedValue(["content", activeLanguage, "hero", "features", index, "title"], e.target.value)
                            }
                          />
                          <Textarea
                            placeholder="Description"
                            value={feature.description}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "hero", "features", index, "description"],
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Button Text"
                            value={feature.buttonText}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "hero", "features", index, "buttonText"],
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Button Link"
                            value={feature.buttonLink}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "hero", "features", index, "buttonLink"],
                                e.target.value
                              )
                            }
                          />
                          <Button
                            variant="destructive"
                            onClick={() => removeArrayItem(["content", activeLanguage, "hero", "features"], index)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Remove Feature
                          </Button>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                    <Button
                      onClick={() =>
                        addArrayItem(
                          ["content", activeLanguage, "hero", "features"],
                          { icon: "", title: "", description: "", buttonText: "", buttonLink: "" }
                        )
                      }
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Feature
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ------- About ------- */}
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
                      onChange={(e) => updateNestedValue(["content", activeLanguage, "about", "mission"], e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Values</Label>
                    <Textarea
                      value={currentContent.about.values}
                      onChange={(e) => updateNestedValue(["content", activeLanguage, "about", "values"], e.target.value)}
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

                {/* Person */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Person Section (Individual Lawyer)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Photo URL</Label>
                    <Input
                      value={currentContent.person.photo}
                      onChange={(e) => updateNestedValue(["content", activeLanguage, "person", "photo"], e.target.value)}
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
                      onChange={(e) => updateNestedValue(["content", activeLanguage, "person", "title"], e.target.value)}
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
                              e.target.value
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
                              e.target.value
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
                              e.target.value
                            )
                          }
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeArrayItem(["content", activeLanguage, "person", "experience"], index)}
                          className="mt-2"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        addArrayItem(
                          ["content", activeLanguage, "person", "experience"],
                          { dateRange: "", role: "", details: "" }
                        )
                      }
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Experience
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
                              e.target.value
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
                      onClick={() =>
                        addArrayItem(["content", activeLanguage, "person", "careerHighlights"], "")
                      }
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Highlight
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ------- Services ------- */}
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
                      onChange={(e) => updateNestedValue(["content", activeLanguage, "services", "title"], e.target.value)}
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
                              updateNestedValue(["content", activeLanguage, "services", "items", index, "icon"], e.target.value)
                            }
                          />
                          <Input
                            placeholder="Title"
                            value={service.title}
                            onChange={(e) =>
                              updateNestedValue(["content", activeLanguage, "services", "items", index, "title"], e.target.value)
                            }
                          />
                          <Textarea
                            placeholder="Description"
                            value={service.description}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "services", "items", index, "description"],
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Button Text"
                            value={service.buttonText}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "services", "items", index, "buttonText"],
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Button Link"
                            value={service.buttonLink}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "services", "items", index, "buttonLink"],
                                e.target.value
                              )
                            }
                          />
                          <Button
                            variant="destructive"
                            onClick={() => removeArrayItem(["content", activeLanguage, "services", "items"], index)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Remove Service
                          </Button>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                    <Button
                      onClick={() =>
                        addArrayItem(
                          ["content", activeLanguage, "services", "items"],
                          { icon: "", title: "", description: "", buttonText: "", buttonLink: "" }
                        )
                      }
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ------- Team ------- */}
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
                              updateNestedValue(["content", activeLanguage, "team", "members", index, "photo"], e.target.value)
                            }
                          />
                          <Input
                            placeholder="Name"
                            value={member.name}
                            onChange={(e) =>
                              updateNestedValue(["content", activeLanguage, "team", "members", index, "name"], e.target.value)
                            }
                          />
                          <Input
                            placeholder="Role"
                            value={member.role}
                            onChange={(e) =>
                              updateNestedValue(["content", activeLanguage, "team", "members", index, "role"], e.target.value)
                            }
                          />
                          <Input
                            placeholder="Bio Link"
                            value={member.bioLink}
                            onChange={(e) =>
                              updateNestedValue(["content", activeLanguage, "team", "members", index, "bioLink"], e.target.value)
                            }
                          />
                          <Input
                            placeholder="Bio Button Text"
                            value={member.bioButton}
                            onChange={(e) =>
                              updateNestedValue(["content", activeLanguage, "team", "members", index, "bioButton"], e.target.value)
                            }
                          />
                          <Button
                            variant="destructive"
                            onClick={() => removeArrayItem(["content", activeLanguage, "team", "members"], index)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Remove Member
                          </Button>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                    <Button
                      onClick={() =>
                        addArrayItem(
                          ["content", activeLanguage, "team", "members"],
                          { photo: "", name: "", role: "", bioLink: "", bioButton: "" }
                        )
                      }
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Team Member
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ------- Contact ------- */}
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
                        onChange={(e) => updateNestedValue(["content", activeLanguage, "contact", "title"], e.target.value)}
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
                          updateNestedValue(["content", activeLanguage, "contact", "details", "address"], e.target.value)
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
                            e.target.value
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
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Type"
                            value={field.type}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "contact", "formFields", index, "type"],
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Name"
                            value={field.name}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "contact", "formFields", index, "name"],
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Placeholder"
                            value={field.placeholder}
                            onChange={(e) =>
                              updateNestedValue(
                                ["content", activeLanguage, "contact", "formFields", index, "placeholder"],
                                e.target.value
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
                          <Trash2 className="w-4 h-4 mr-2" /> Remove Field
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        addArrayItem(
                          ["content", activeLanguage, "contact", "formFields"],
                          { label: "", type: "text", name: "", placeholder: "" }
                        )
                      }
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Form Field
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
