import type { ContentData } from "@/types"

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
}

export function ensureSkeleton(raw: any): ContentData {
  const base = JSON.parse(JSON.stringify(DEFAULT_DATA)) as ContentData
  const src = (raw?.data ? raw.data : raw) || {}

  function merge(target: any, from: any) {
    Object.keys(from || {}).forEach((k) => {
      if (from[k] && typeof from[k] === "object" && !Array.isArray(from[k])) {
        if (!target[k]) target[k] = {}
        merge(target[k], from[k])
      } else {
        target[k] = from[k]
      }
    })
  }

  merge(base, src)
  return base
}
