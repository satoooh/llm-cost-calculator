"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type React from "react"; // Added import for React

interface Model {
  name: string;
  inputPrice: number;
  outputPrice: number;
}

interface ModelSelectorProps {
  models: Model[];
  selectedModels: string[];
  setSelectedModels: (models: string[]) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModels,
  setSelectedModels,
}) => {
  const handleModelChange = (modelName: string) => {
    if (selectedModels.includes(modelName)) {
      setSelectedModels(selectedModels.filter((name) => name !== modelName));
    } else {
      setSelectedModels([...selectedModels, modelName]);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">モデル選択</h3>
      <div className="space-y-2">
        {models.map((model) => (
          <div key={model.name} className="flex items-center space-x-2">
            <Checkbox
              id={model.name}
              checked={selectedModels.includes(model.name)}
              onCheckedChange={() => handleModelChange(model.name)}
            />
            <Label htmlFor={model.name} className="text-sm">
              {model.name}{" "}
              <span className="text-xs text-gray-500">
                (入力: ${model.inputPrice}/1Mトークン, 出力: $
                {model.outputPrice}/1Mトークン)
              </span>
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
