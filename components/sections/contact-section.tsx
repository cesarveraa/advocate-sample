"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import type { ContentData } from "@/types"

interface ContactSectionProps {
  currentContent: ContentData["content"]["es"]
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
          {/* Contact Form */}
          <Card className="bg-[var(--card-bg)] border-[var(--border)] animate-section">
            <CardContent className="p-6">
              <form className="space-y-6">
                {currentContent.contact.formFields.map((field, index) => (
                  <div key={index}>
                    <Label htmlFor={field.name} className="text-[var(--text-primary)]">
                      {field.label}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        className="bg-[var(--card-bg)] border-[var(--border)] text-[var(--text-primary)]"
                      />
                    ) : (
                      <Input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        className="bg-[var(--card-bg)] border-[var(--border)] text-[var(--text-primary)]"
                      />
                    )}
                  </div>
                ))}
                <Button
                  type="submit"
                  onClick={() => trackPageClick("contact")}
                  className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white"
                >
                  {currentContent.contact.submitButtonText}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info and Map */}
          <div className="space-y-8 animate-section">
            <Card className="bg-[var(--card-bg)] border-[var(--border)]">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[var(--text-primary)]" />
                  <p className="text-[var(--text-secondary)]">{currentContent.contact.details.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--text-primary)]" />
                  <a
                    href={`tel:${currentContent.contact.details.phone}`}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                  >
                    {currentContent.contact.details.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--text-primary)]" />
                  <a
                    href={`mailto:${currentContent.contact.details.email}`}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                  >
                    {currentContent.contact.details.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[var(--text-primary)]" />
                  <p className="text-[var(--text-secondary)]">{currentContent.contact.details.hours}</p>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
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
