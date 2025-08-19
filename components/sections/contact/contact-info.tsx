"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ContactInfoItem } from "@/components/ui/contact-info-item"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import type { ContactDetails } from "@/types"

interface ContactInfoProps {
  details: ContactDetails
  onPhoneClick?: () => void
  onEmailClick?: () => void
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ details, onPhoneClick, onEmailClick }) => {
  return (
    <Card className="bg-[var(--card-bg)] border-[var(--border)]">
      <CardContent className="p-6 space-y-4">
        <ContactInfoItem icon={<MapPin />}>{details.address}</ContactInfoItem>

        <ContactInfoItem icon={<Phone />} href={`tel:${details.phone}`} onClick={onPhoneClick}>
          {details.phone}
        </ContactInfoItem>

        <ContactInfoItem icon={<Mail />} href={`mailto:${details.email}`} onClick={onEmailClick}>
          {details.email}
        </ContactInfoItem>

        <ContactInfoItem icon={<Clock />}>{details.hours}</ContactInfoItem>
      </CardContent>
    </Card>
  )
}
