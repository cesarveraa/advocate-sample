const API_HOST = "https://server-advocate.vercel.app"
const IMAGE_API_BASE = "https://crea-tendencia-images.vercel.app/images"

export class ApiService {
  static async uploadImages(imageUploads: Record<string, File | null>): Promise<Record<string, string>> {
    const idMap: Record<string, string> = {}

    for (const [pathKey, file] of Object.entries(imageUploads)) {
      if (!file) continue

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${IMAGE_API_BASE}/upload-image/`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => "")
        throw new Error(`Failed to upload image (${pathKey}): ${response.status} ${errorText}`)
      }

      const { id } = (await response.json()) as { id: string; filename: string; size_b64: number }
      idMap[pathKey] = id
    }

    return idMap
  }

  static async createProfile(code: string, data: any) {
    const payload = { code, data }

    const response = await fetch(`${API_HOST}/lawyers/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "")
      throw new Error(`Failed to create profile: ${response.status} ${errorText}`)
    }

    return response.json()
  }

  static async loadProfile(code: string) {
    const response = await fetch(`${API_HOST}/lawyers/${code}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Profile not found")
      }
      throw new Error("Error loading profile")
    }

    const { data } = await response.json()
    return data
  }
}
