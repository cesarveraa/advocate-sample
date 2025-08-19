const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL!

export const authService = {
  async login(email: string, password: string): Promise<string> {
    const res = await fetch(`${AUTH_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(`Login falló (${res.status}): ${text}`)
    }

    const json = await res.json()
    if (!json.idToken) {
      throw new Error("El server de Auth no devolvió idToken")
    }

    return json.idToken
  },

  async logout(): Promise<void> {
    await fetch(`${AUTH_API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
  },
}
