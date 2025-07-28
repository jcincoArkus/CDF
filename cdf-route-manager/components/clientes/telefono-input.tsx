"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface TelefonoInputProps {
  id?: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  disabled?: boolean
}

export function TelefonoInput({
  id,
  value,
  onChange,
  error,
  placeholder = "555-123-4567",
  disabled = false,
}: TelefonoInputProps) {
  const [displayValue, setDisplayValue] = useState("")

  useEffect(() => {
    setDisplayValue(formatTelefono(value))
  }, [value])

  const formatTelefono = (input: string) => {
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, "")

    // Format as XXX-XXX-XXXX
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const formatted = formatTelefono(input)

    // Only allow up to 10 digits (formatted as XXX-XXX-XXXX)
    if (formatted.replace(/\D/g, "").length <= 10) {
      setDisplayValue(formatted)
      onChange(formatted.replace(/\D/g, "")) // Send only numbers to parent
    }
  }

  return (
    <div className="space-y-1">
      <Input
        id={id}
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={error ? "border-red-500" : ""}
        maxLength={12} // XXX-XXX-XXXX format
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
