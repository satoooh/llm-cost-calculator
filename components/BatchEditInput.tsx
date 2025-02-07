"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BatchEditInputProps {
  label: string
  value: number
  onChange: (value: number) => void
}

const BatchEditInput: React.FC<BatchEditInputProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <Label htmlFor={`batch-${label}`} className="text-xs font-medium mb-1 block">
        {label}
      </Label>
      <Input
        id={`batch-${label}`}
        type="number"
        value={value}
        onChange={(e) => onChange(Number.parseInt(e.target.value, 10))}
        className="h-8"
      />
    </div>
  )
}

export default BatchEditInput

