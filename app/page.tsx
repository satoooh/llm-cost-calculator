"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import InputForm from "../components/InputForm";
import { ModelsCombobox } from "../components/ui/combobox";
import ResultsTable from "../components/ResultsTable";
import CustomModelForm from "../components/CustomModelForm";
import BatchEditInput from "../components/BatchEditInput";
import { calculateTokens } from "../utils/tokenCalculator";
import { calculateCosts } from "../utils/costCalculator";
import defaultModels from "../data/defaultModels.json";

export interface DefaultModel {
  model: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
  contextWindow: number;
}

export interface Model {
  name: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
  contextWindow: number;
}

interface CostResult {
  modelName: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  contextWindow: number;
  callCount?: number;
}

const DEFAULT_SELECTED_MODELS = [
  // OpenAI
  "GPT-4",
  "GPT-4 Mini",
  "OpenAI 1",
  "GPT-3.5 Turbo",
  // Anthropic
  "Claude 3.5 Sonnet",
  "Claude 3.5 Haiku",
  // Google
  "Gemini 1.5 Pro",
  "Gemini 2.0 Flash",
  // その他
  "DeepSeek R1",
  "Mistral 7B",
];

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>(
    DEFAULT_SELECTED_MODELS
  );
  const [customModels, setCustomModels] = useState<Model[]>([]);
  const [results, setResults] = useState<CostResult[]>([]);
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);
  const [callCount, setCallCount] = useState(1);

  useEffect(() => {
    if (inputText || outputText) {
      const calculatedInputTokens = calculateTokens(inputText);
      const calculatedOutputTokens = calculateTokens(outputText);
      setInputTokens(calculatedInputTokens);
      setOutputTokens(calculatedOutputTokens);
    }

    const allModels = [
      ...(defaultModels as DefaultModel[]),
      ...customModels,
    ].map((model) => ({
      name: "model" in model ? model.model : model.name,
      provider: model.provider,
      inputPrice: model.inputPrice,
      outputPrice: model.outputPrice,
      contextWindow: model.contextWindow,
    })) as Model[];

    const selectedModelData = allModels.filter((model) =>
      selectedModels.includes(model.name)
    );
    const costs = calculateCosts(selectedModelData, inputTokens, outputTokens);
    setResults(costs.map((cost) => ({ ...cost, callCount })));
  }, [
    inputText,
    outputText,
    selectedModels,
    customModels,
    callCount,
    inputTokens,
    outputTokens,
  ]);

  useEffect(() => {
    const defaultModelData = (defaultModels as DefaultModel[]).map((model) => ({
      name: model.model,
      provider: model.provider,
      inputPrice: model.inputPrice,
      outputPrice: model.outputPrice,
      contextWindow: model.contextWindow,
    })) as Model[];

    const selectedDefaultModels = defaultModelData.filter((model) =>
      DEFAULT_SELECTED_MODELS.includes(model.name)
    );
    const initialCosts = calculateCosts(
      selectedDefaultModels,
      inputTokens,
      outputTokens
    );
    setResults(initialCosts.map((cost) => ({ ...cost, callCount })));
  }, [callCount, inputTokens, outputTokens]);

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  const handleOutputChange = (text: string) => {
    setOutputText(text);
  };

  const handleCallCountChange = (count: number) => {
    setCallCount(count);
  };

  const allModels = [...(defaultModels as DefaultModel[]), ...customModels].map(
    (model) => ({
      name: "model" in model ? model.model : model.name,
      provider: model.provider,
      inputPrice: model.inputPrice,
      outputPrice: model.outputPrice,
      contextWindow: model.contextWindow,
    })
  ) as Model[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              LLM Cost Calculator
            </h1>
            <p className="text-sm text-muted-foreground">
              総トークン数: {inputTokens + outputTokens}
            </p>
          </div>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ModelsCombobox
                      models={allModels}
                      selectedModels={selectedModels}
                      setSelectedModels={setSelectedModels}
                    />
                    <div className="mt-4">
                      <CustomModelForm
                        models={customModels}
                        setModels={setCustomModels}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <InputForm
                      inputText={inputText}
                      outputText={outputText}
                      onInputChange={handleInputChange}
                      onOutputChange={handleOutputChange}
                      callCount={callCount}
                      onCallCountChange={handleCallCountChange}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <BatchEditInput
                        label="入力トークン"
                        value={inputTokens}
                        onChange={(value) => setInputTokens(value)}
                      />
                      <BatchEditInput
                        label="出力トークン"
                        value={outputTokens}
                        onChange={(value) => setOutputTokens(value)}
                      />
                      <BatchEditInput
                        label="呼び出し回数"
                        value={callCount}
                        onChange={(value) => handleCallCountChange(value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <ResultsTable
                  results={results}
                  inputTokens={inputTokens}
                  outputTokens={outputTokens}
                  callCount={callCount}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
