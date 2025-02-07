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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

/* Inserted types for better type safety */

type ModelType = {
  name: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
};

interface CostResult {
  modelName: string;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

const DEFAULT_SELECTED_MODELS = ["GPT-4o", "o3-mini"];

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>(
    DEFAULT_SELECTED_MODELS
  );
  const [customModels, setCustomModels] = useState<ModelType[]>([]);
  const [results, setResults] = useState<CostResult[]>([]);
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);
  const [callCount, setCallCount] = useState(1);

  useEffect(() => {
    // テキストが変更された時のみトークン数を更新
    if (inputText || outputText) {
      const calculatedInputTokens = calculateTokens(inputText);
      const calculatedOutputTokens = calculateTokens(outputText);
      setInputTokens(calculatedInputTokens);
      setOutputTokens(calculatedOutputTokens);
    }

    const allModels = [...defaultModels, ...customModels];
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

  // 初期表示時にデフォルトモデルの結果を計算
  useEffect(() => {
    const defaultModelData = defaultModels.filter((model) =>
      DEFAULT_SELECTED_MODELS.includes(model.name)
    );
    const initialCosts = calculateCosts(
      defaultModelData,
      inputTokens,
      outputTokens
    );
    setResults(initialCosts.map((cost) => ({ ...cost, callCount })));
  }, []);

  const handleBatchUpdate = (
    type: "input" | "output" | "callCount",
    value: number
  ) => {
    if (type === "input") {
      setInputTokens(value);
    } else if (type === "output") {
      setOutputTokens(value);
    } else {
      setCallCount(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                  <InputForm
                    inputText={inputText}
                    setInputText={setInputText}
                    label="入力テキスト"
                    tokenCount={inputTokens}
                  />
                  <InputForm
                    inputText={outputText}
                    setInputText={setOutputText}
                    label="出力テキスト（想定）"
                    tokenCount={outputTokens}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ModelsCombobox
                    models={[...defaultModels, ...customModels]}
                    selectedModels={selectedModels}
                    setSelectedModels={setSelectedModels}
                    defaultSelectedModels={DEFAULT_SELECTED_MODELS}
                  />
                  <CustomModelForm
                    customModels={customModels}
                    setCustomModels={setCustomModels}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <BatchEditInput
                    label="入力トークン"
                    value={inputTokens}
                    onChange={(value) => handleBatchUpdate("input", value)}
                  />
                  <BatchEditInput
                    label="出力トークン"
                    value={outputTokens}
                    onChange={(value) => handleBatchUpdate("output", value)}
                  />
                  <BatchEditInput
                    label="呼び出し回数"
                    value={callCount}
                    onChange={(value) => handleBatchUpdate("callCount", value)}
                  />
                </div>

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
