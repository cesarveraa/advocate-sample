"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import type { FormField as FormFieldType } from "@/types"

interface ContactFormProps {
  formFields: FormFieldType[]
  submitButtonText: string
  onSubmit: () => void
}

export const ContactForm: React.FC<ContactFormProps> = ({ formFields, submitButtonText, onSubmit }) => {
  return (
    <Card className="bg-[var(--card-bg)] border-[var(--border)] animate-section">
      <CardContent className="p-6">
        <form className="space-y-6">
          {formFields.map((field, index) => (
            <FormField
              key={index}
              label={field.label}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
            />
          ))}
          <Button
            type="submit"
            onClick={onSubmit}
            className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white"
          >
            {submitButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
