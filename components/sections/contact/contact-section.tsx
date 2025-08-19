"use client"

import type React from "react"
import { ContactForm } from "./contact-form"
import { ContactInfo } from "./contact-info"
import type { LanguageContent } from "@/types"

interface ContactSectionProps {
  currentContent: LanguageContent
  trackPageClick: (section: string) => void
}

export const ContactSection: React.FC<ContactSectionProps> = ({ currentContent, trackPageClick }) => {
  return (
    <section id="contact" className="py-20 bg-[var(--bg)] animate-section">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">
          {currentContent.contact.title}
        </h2>

        <div className="grid lg:grid-cols-2 gap-12">
          <ContactForm
            formFields={currentContent.contact.formFields}
            submitButtonText={currentContent.contact.submitButtonText}
            onSubmit={() => trackPageClick("contact")}
          />

          <div className="space-y-8 animate-section">
            <ContactInfo
              details={currentContent.contact.details}
              onPhoneClick={() => trackPageClick("phone")}
              onEmailClick={() => trackPageClick("email")}
            />

            <div className="h-64 md:h-80 rounded-lg overflow-hidden">
              <iframe
                src={currentContent.contact.location.embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
