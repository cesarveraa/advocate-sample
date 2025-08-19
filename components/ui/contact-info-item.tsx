"use client"

import type React from "react"

interface ContactInfoItemProps {
  icon: React.ReactNode
  children: React.ReactNode
  href?: string
  onClick?: () => void
}

export const ContactInfoItem: React.FC<ContactInfoItemProps> = ({ icon, children, href, onClick }) => {
  const content = (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 text-[var(--text-primary)] flex items-center justify-center">{icon}</div>
      <div className="text-[var(--text-secondary)]">{children}</div>
    </div>
  )

  if (href) {
    return (
      <a href={href} onClick={onClick} className="hover:text-[var(--primary-color)] transition-colors">
        {content}
      </a>
    )
  }

  return content
}
