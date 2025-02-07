"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Model } from "@/app/page";

interface CustomModelFormProps {
  models: Model[];
  setModels: (models: Model[]) => void;
}

const CustomModelForm: React.FC<CustomModelFormProps> = ({
  models,
  setModels,
}) => {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [outputPrice, setOutputPrice] = useState("");
  const [contextWindow, setContextWindow] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && provider && inputPrice && outputPrice && contextWindow) {
      const newModel: Model = {
        name,
        provider,
        inputPrice: Number.parseFloat(inputPrice),
        outputPrice: Number.parseFloat(outputPrice),
        contextWindow: Number.parseInt(contextWindow, 10),
      };
      setModels([...models, newModel]);
      setName("");
      setProvider("");
      setInputPrice("");
      setOutputPrice("");
      setContextWindow("");
      setOpen(false);
    }
  };

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
            <Input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="プロバイダー名"
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
          <div>
            <Input
              type="number"
              value={contextWindow}
              onChange={(e) => setContextWindow(e.target.value)}
              placeholder="コンテキストウィンドウ"
              className="h-8"
              min="1"
            />
          </div>
          <Button type="submit" className="w-full h-8">
            追加
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default CustomModelForm;
