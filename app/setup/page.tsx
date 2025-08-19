"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useSetupWizard } from "@/hooks/use-setup-wizard"
import { useContentOperations } from "@/hooks/use-content-operations"
import { useImageOperations } from "@/hooks/use-image-operations"
import { WizardHeader } from "@/components/setup/wizard-header"
import { WizardControls } from "@/components/setup/wizard-controls"
import { WizardNavigation } from "@/components/setup/wizard-navigation"
import { FinishStep } from "@/components/setup/finish-step"
import { BasicConfiguration } from "@/components/setup/basic-configuration"
import { GeneralInformation } from "@/components/setup/general-information"
import { ServicesSetup } from "@/components/setup/services-setup"
import { TeamSetup } from "@/components/setup/team-setup"
import { SuccessCasesSetup } from "@/components/setup/success-cases-setup"
import { ContactSetup } from "@/components/setup/contact-setup"

export default function SetupWizard() {
  const {
    currentStep,
    contentData,
    setContentData,
    activeLanguage,
    setActiveLanguage,
    saveStatus,
    isSubmitting,
    steps,
    nextStep,
    prevStep,
    handleCreateProfile,
  } = useSetupWizard()

  const { updateNestedValue, addArrayItem, removeArrayItem } = useContentOperations(contentData, setContentData)

  const { previewUrls, handleImageUpload } = useImageOperations()

  const currentContent = contentData.content[activeLanguage]

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicConfiguration contentData={contentData} updateNestedValue={updateNestedValue} />
      case 1:
        return (
          <GeneralInformation
            contentData={contentData}
            activeLanguage={activeLanguage}
            updateNestedValue={updateNestedValue}
            handleImageUpload={handleImageUpload}
            previewUrls={previewUrls}
          />
        )
      case 2:
        return (
          <ServicesSetup
            currentContent={currentContent}
            activeLanguage={activeLanguage}
            updateNestedValue={updateNestedValue}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            handleImageUpload={handleImageUpload}
            previewUrls={previewUrls}
          />
        )
      case 3:
        return (
          <TeamSetup
            contentData={contentData}
            currentContent={currentContent}
            activeLanguage={activeLanguage}
            updateNestedValue={updateNestedValue}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            handleImageUpload={handleImageUpload}
            previewUrls={previewUrls}
          />
        )
      case 4:
        return (
          <SuccessCasesSetup
            currentContent={currentContent}
            activeLanguage={activeLanguage}
            updateNestedValue={updateNestedValue}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        )
      case 5:
        return (
          <ContactSetup
            currentContent={currentContent}
            activeLanguage={activeLanguage}
            updateNestedValue={updateNestedValue}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        )
      case 6:
        return (
          <FinishStep
            contentData={contentData}
            currentContent={currentContent}
            onCreateProfile={handleCreateProfile}
            isSubmitting={isSubmitting}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <WizardHeader currentStep={currentStep} steps={steps} />

        <WizardControls activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} saveStatus={saveStatus} />

        <Card className="mb-8">
          <CardContent className="p-6">{renderStep()}</CardContent>
        </Card>

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          prevStep={prevStep}
          nextStep={nextStep}
          onCreateProfile={handleCreateProfile}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
