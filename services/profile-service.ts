// services/profile-service.ts
import { nanoid } from "nanoid/non-secure"
import type { ContentData } from "@/types"
// === AUTH FLAGS ===
const USE_DIRECT_FIREBASE_BEARER = true;   // <- usamos el ID token de Firebase directo
const SKIP_EXCHANGE_COMPLETELY = true;     // <- ni lo intentamos

/**
 * ================================
 *  CONFIG
 * ================================
 * Unificamos todo en el mismo host (Bearer).
 * Si no hay env, usamos server-advocate por defecto.
 */
const ADV_API = process.env.NEXT_PUBLIC_ADVOCATE_API_URL ?? "https://server-advocate.vercel.app"
const IMAGE_API_BASE = `https://crea-tendencia-images.vercel.app/images`

/**
 * Endpoints candidatos para el intercambio del ID token de Firebase por
 * un token propio del backend (ajusta si tu API usa otro).
 */
const EXCHANGE_PATHS = [
  "/auth/exchange/firebase",
  "/auth/firebase/exchange",
  "/auth/exchange",
  "/auth/token/exchange",
]

/* ───────────────────────── helpers ───────────────────────── */

function log(...args: any[]) {
  // Cambia a console.debug si prefieres menos ruido.
  // @ts-ignore
  console.log("[authA]", ...args)
}

function setByPath(obj: any, pathKey: string, value: any) {
  const parts = pathKey.split(".")
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i]
    if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {}
    cur = cur[k]
  }
  cur[parts[parts.length - 1]] = value
}

function parseJwt(token: string): Record<string, any> | null {
  try {
    const [, payload] = token.split(".")
    if (!payload) return null
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4 || 4)) % 4, "=")
    const jsonStr = (typeof atob === "function")
      ? atob(padded)
      // @ts-ignore
      : Buffer.from(padded, "base64").toString("utf8")
    return JSON.parse(jsonStr)
  } catch { return null }
}


function isFirebaseIdToken(token: string): boolean {
  const p = parseJwt(token)
  return !!p?.iss && String(p.iss).startsWith("https://securetoken.google.com/")
}

function isExpired(token: string, skewSeconds = 30): boolean {
  const p = parseJwt(token)
  if (!p?.exp) return false
  const now = Math.floor(Date.now() / 1000)
  return now >= (p.exp as number) - skewSeconds
}

const STORAGE_KEY = "adv_backend_token"

function getStoredBackendToken(): string | null {
  try {
    const t = localStorage.getItem(STORAGE_KEY)
    if (!t) return null
    if (isExpired(t)) {
      log("Token backend en storage expirado → se eliminará.")
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return t
  } catch {
    return null
  }
}

function setStoredBackendToken(token: string) {
  try {
    localStorage.setItem(STORAGE_KEY, token)
  } catch {}
}

type FetchAuthOpts = RequestInit & { token?: string }

async function fetchWithAuth(url: string, opts: FetchAuthOpts = {}) {
  const headers = new Headers(opts.headers || {})
  if (opts.token) headers.set("Authorization", `Bearer ${opts.token}`)
  headers.set("Accept", "application/json")
  return fetch(url, { ...opts, headers })
}

/**
 * Intercambia un ID token de Firebase por el token propio del backend.
 * Prueba una lista de rutas comunes hasta que una responda 2xx.
 */
async function exchangeFirebaseForBackendJWT(firebaseIdToken: string): Promise<string | null> {
  if (SKIP_EXCHANGE_COMPLETELY) {
    console.log("[authA] SKIP_EXCHANGE_COMPLETELY activo → no se intenta exchange");
    return null
  }

  const headers = { "Content-Type": "application/json", Accept: "application/json" }
  const body = JSON.stringify({ idToken: firebaseIdToken })

  for (const path of EXCHANGE_PATHS) {
    const url = `${ADV_API}${path}`
    try {
      console.log("[authA] intentando exchange en", path)
      const res = await fetch(url, { method: "POST", headers, body })
      const txt = await res.text().catch(() => "")

      if (!res.ok) {
        console.log("[authA] exchange FAIL", res.status, txt || "")
        continue
      }

      // intenta json o texto JWT
      try {
        const json = JSON.parse(txt)
        const token =
          json.access_token || json.token || json.idToken || json.jwt || json.data?.access_token || ""
        if (token) return token
      } catch {
        if (txt && txt.split(".").length >= 3) return txt
      }
      console.log("[authA] exchange ok pero no encontré campo token, payload:", txt)
    } catch (e: any) {
      console.log("[authA] exchange error de red en", path, e?.message ?? e)
    }
  }

  // 👉 No hay endpoint válido
  return null
}


/**
 * Devuelve un token válido para el backend:
 * - Si ya tienes un token de backend en storage y no expiró → usa ese.
 * - Si recibes un token de Firebase → intenta exchange y guarda el token backend.
 * - Si recibes un token que ya parece del backend → úsalo tal cual.
 */
async function coerceToBackendToken(anyToken: string): Promise<string> {
  // Si es Firebase ID token, úsalo directo (opción A)
  if (isFirebaseIdToken(anyToken)) {
    console.log("[authA] Token detectado como Firebase")
    if (USE_DIRECT_FIREBASE_BEARER) {
      // Intento exchange solo si no está bloqueado y existe algo que responda,
      // pero si no hay, seguimos con el ID token SIN lanzar error.
      const exchanged = await exchangeFirebaseForBackendJWT(anyToken)
      return exchanged ?? anyToken
    }
  }

  // Si no es Firebase, asumimos token backend
  return anyToken
}


/* ───────────────────────── imágenes ───────────────────────── */

async function uploadPendingImages(imageUploads: Record<string, File | null>): Promise<Record<string, string>> {
  const idMap: Record<string, string> = {}
  for (const [pathKey, file] of Object.entries(imageUploads)) {
    if (!file) continue
    const fd = new FormData()
    fd.append("file", file)

    const url = `${IMAGE_API_BASE}/upload-image/`
    log("→ POST", url.replace(IMAGE_API_BASE, "/upload-image"))
    const res = await fetch(url, { method: "POST", body: fd })
    if (!res.ok) {
      const t = await res.text().catch(() => "")
      throw new Error(`Falló subir imagen (${pathKey}): ${res.status} ${t}`)
    }
    const { id } = (await res.json()) as { id: string; filename: string; size_b64: number }
    idMap[pathKey] = id
  }
  return idMap
}

/* ───────────────────────── API pública ───────────────────────── */

export async function createProfile(
  contentData: ContentData,
  imageUploads: Record<string, File | null>,
  setSaveStatus: (status: string) => void,
) {
  setSaveStatus("Subiendo imágenes...")
  const idMap = await uploadPendingImages(imageUploads)

  const dataToSend: ContentData = JSON.parse(JSON.stringify(contentData))
  for (const [pathKey, id] of Object.entries(idMap)) {
    setByPath(dataToSend as any, pathKey, id)
  }

  setSaveStatus("Creando perfil...")

  const payload = {
    code: nanoid(8),
    data: dataToSend,
  }

  const url = `${ADV_API}/lawyers/`
  log("→ POST", "/lawyers")
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  })

  const text = await res.text()
  if (!res.ok) {
    let errJson = {}
    try {
      errJson = JSON.parse(text)
    } catch {}
    log("❌ Detalle error server:", errJson)
    throw new Error("Error al crear el perfil")
  }

  return JSON.parse(text) as { code: string; data: ContentData }
}
export const profileService = {
  async getMyPage(firebaseIdToken: string) {
    const bearer = await coerceToBackendToken(firebaseIdToken)
    const url = `${ADV_API}/auth/users/me/lawyer`
    const res = await fetchWithAuth(url, { method: "GET", token: bearer })

    const txt = await res.text().catch(() => "")
    if (!res.ok) {
      console.log("[authA] getMyPage FAIL", res.status, txt)
      throw new Error(`getMyPage fallo ${res.status}`)
    }
    try {
      return JSON.parse(txt)
    } catch {
      return txt as any
    }
  },

  async updateMyPage(anyToken: string, contentData: ContentData) {
    const token = await coerceToBackendToken(anyToken)
    const res = await fetchWithAuth(`${ADV_API}/auth/users/me/lawyer`, {
      method: "PUT",
      token,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ data: contentData }),
    })
    const text = await res.text().catch(() => "")
    if (!res.ok) throw new Error(`Error al guardar (${res.status}): ${text}`)
    try { return JSON.parse(text) } catch { return text as any }
  },
}
