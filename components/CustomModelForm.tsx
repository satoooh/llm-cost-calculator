"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CustomModel {
  name: string
  inputPrice: number
  outputPrice: number
}

interface CustomModelFormProps {
  customModels: CustomModel[]
  setCustomModels: (models: CustomModel[]) => void
}

const CustomModelForm: React.FC<CustomModelFormProps> = ({ customModels, setCustomModels }) => {
  const [name, setName] = useState("")
  const [inputPrice, setInputPrice] = useState("")
  const [outputPrice, setOutputPrice] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && inputPrice && outputPrice) {
      const newModel: CustomModel = {
        name,
        inputPrice: Number.parseFloat(inputPrice),
        outputPrice: Number.parseFloat(outputPrice),
      }
      setCustomModels([...customModels, newModel])
      setName("")
      setInputPrice("")
      setOutputPrice("")
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          カスタムモデルを追加
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="モデル名"
              className="h-8"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={inputPrice}
              onChange={(e) => setInputPrice(e.target.value)}
              placeholder="入力単価 $/1M"
              className="h-8"
              step="0.000001"
            />
            <Input
              type="number"
              value={outputPrice}
              onChange={(e) => setOutputPrice(e.target.value)}
              placeholder="出力単価 $/1M"
              className="h-8"
              step="0.000001"
            />
          </div>
          <Button type="submit" className="w-full h-8">
            追加
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}

export default CustomModelForm

