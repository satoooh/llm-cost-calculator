"use client"

import type React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface InputFormProps {
  inputText: string
  setInputText: (text: string) => void
  label: string
  tokenCount: number
}

const InputForm: React.FC<InputFormProps> = ({ inputText, setInputText, label, tokenCount }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={label} className="text-sm font-medium">
          {label}
        </Label>
        <span className="text-xs text-muted-foreground">{tokenCount.toLocaleString()} tokens</span>
      </div>
      <Textarea
        id={label}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="テキストを入力してください"
        className="h-24 resize-none"
      />
    </div>
  )
}

export default InputForm

