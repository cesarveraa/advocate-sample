"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { useAdminContent } from "@/hooks/use-admin-content"
import { useContentOperations } from "@/hooks/use-content-operations"
import { LoginForm } from "@/components/admin/login-form"
import { AdminHeader } from "@/components/admin/admin-header"
import { SettingsTab } from "@/components/admin/settings-tab"

export default function AdminPanel() {
  const [activeLanguage, setActiveLanguage] = useState("es")

  const {
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
  } = useAdminAuth()

  const { contentData, setContentData, loading, saveStatus, isSaving, loadMyPage, saveContent } = useAdminContent(
    idToken,
    isLoggedIn,
  )

  const { updateNestedValue, addArrayItem, removeArrayItem } = useContentOperations(
    contentData || ({} as any),
    setContentData,
  )

  if (!isAuthChecked || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isLoggedIn) {
    return (
      <LoginForm
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        loginError={loginError}
        loginLoading={loginLoading}
        onSubmit={handleLogin}
      />
    )
  }

  const currentContent = contentData?.content?.[activeLanguage]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <AdminHeader
          activeLanguage={activeLanguage}
          setActiveLanguage={setActiveLanguage}
          saveStatus={saveStatus}
          isSaving={isSaving}
          onSave={saveContent}
          onReload={() => idToken && loadMyPage()}
          onLogout={handleLogout}
          hasContent={!!contentData}
        />

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

            <TabsContent value="settings">
              <SettingsTab contentData={contentData} updateNestedValue={updateNestedValue} />
            </TabsContent>

            <TabsContent value="styling">
              <div className="text-center py-12">
                <p className="text-gray-600">Styling tab - Coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="header">
              <div className="text-center py-12">
                <p className="text-gray-600">Header tab - Coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="hero">
              <div className="text-center py-12">
                <p className="text-gray-600">Hero tab - Coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="about">
              <div className="text-center py-12">
                <p className="text-gray-600">About tab - Coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="services">
              <div className="text-center py-12">
                <p className="text-gray-600">Services tab - Coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="team">
              <div className="text-center py-12">
                <p className="text-gray-600">Team tab - Coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="contact">
              <div className="text-center py-12">
                <p className="text-gray-600">Contact tab - Coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
