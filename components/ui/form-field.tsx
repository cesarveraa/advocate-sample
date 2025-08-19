"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  label: string
  type: string
  name: string
  placeholder: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={className}>
      <Label htmlFor={name} className="text-[var(--text-primary)]">
        {label}
      </Label>
      {type === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="bg-[var(--card-bg)] border-[var(--border)] text-[var(--text-primary)]"
        />
      ) : (
        <Input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="bg-[var(--card-bg)] border-[var(--border)] text-[var(--text-primary)]"
        />
      )}
    </div>
  )
}
