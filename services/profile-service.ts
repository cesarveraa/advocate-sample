import { nanoid } from "nanoid/non-secure"
import type { ContentData } from "@/types"

const API_HOST = "https://server-advocate.vercel.app"
const ADV_API = process.env.NEXT_PUBLIC_ADVOCATE_API_URL!
const IMAGE_API_BASE = `https://crea-tendencia-images.vercel.app/images`

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

async function uploadPendingImages(imageUploads: Record<string, File | null>): Promise<Record<string, string>> {
  const idMap: Record<string, string> = {}
  for (const [pathKey, file] of Object.entries(imageUploads)) {
    if (!file) continue
    const fd = new FormData()
    fd.append("file", file)

    const res = await fetch(`${IMAGE_API_BASE}/upload-image/`, {
      method: "POST",
      body: fd,
    })
    if (!res.ok) {
      const t = await res.text().catch(() => "")
      throw new Error(`Falló subir imagen (${pathKey}): ${res.status} ${t}`)
    }
    const { id } = (await res.json()) as {
      id: string
      filename: string
      size_b64: number
    }
    idMap[pathKey] = id
  }
  return idMap
}

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

  const res = await fetch(`${API_HOST}/lawyers/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const text = await res.text()
  if (!res.ok) {
    let errJson = {}
    try {
      errJson = JSON.parse(text)
    } catch {}
    console.error("❌ Detalle error server:", errJson)
    throw new Error("Error al crear el perfil")
  }

  return JSON.parse(text) as { code: string; data: ContentData }
}

export const profileService = {
  async getMyPage(idToken: string) {
    let res = await fetch(`${ADV_API}/auth/users/me/lawyer`, {
      method: "GET",
      headers: { Authorization: `Bearer ${idToken}` },
    })

    if (res.status === 404) {
      res = await fetch(`${ADV_API}/auth/users/me/lawyer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ data: {} }),
      })
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => "")
      throw new Error(`No se pudo cargar tu página (${res.status}): ${txt}`)
    }

    return await res.json()
  },

  async updateMyPage(idToken: string, contentData: ContentData) {
    const res = await fetch(`${ADV_API}/auth/users/me/lawyer`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ data: contentData }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(`Error al guardar (${res.status}): ${text}`)
    }

    return await res.json()
  },
}
