"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { authService } from "@/services/auth-service"

export function useAdminAuth() {
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      const stored = typeof window !== "undefined" ? localStorage.getItem("idToken") : null
      if (stored) {
        setIdToken(stored)
        setIsLoggedIn(true)
      }
      setIsAuthChecked(true)
    }
    initAuth()
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError(null)

    try {
      const token = await authService.login(loginEmail, loginPassword)
      setIdToken(token)
      localStorage.setItem("idToken", token)
      setIsLoggedIn(true)
    } catch (err: any) {
      console.error(err)
      setLoginError(err.message || "Error al iniciar sesión")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch {
      // noop
    }
    localStorage.removeItem("idToken")
    setIdToken(null)
    setIsLoggedIn(false)
    setLoginEmail("")
    setLoginPassword("")
  }

  return {
    isAuthChecked,
    isLoggedIn,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loginLoading,
    loginError,
    idToken,
    handleLogin,
    handleLogout,
  }
}
