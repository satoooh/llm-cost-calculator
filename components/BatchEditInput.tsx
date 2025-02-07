"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BatchEditInputProps {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
}

const BatchEditInput: React.FC<BatchEditInputProps> = ({
  label = "入力トークン",
  value = 0,
  onChange,
}) => {
  // ツールチップを表示するかどうかを判定
  const showTooltip = label === "入力トークン" || label === "出力トークン";
  // ツールチップの内容をラベルに応じて分岐
  const tooltipText =
    label === "入力トークン"
      ? "入力テキストを gpt-tokenizer でエンコードして得られたトークン数です。入力が空の場合は 0 となります。"
      : "出力テキストを gpt-tokenizer でエンコードして得られたトークン数です。出力テキストがない場合は 0 となります。";

  return (
    <div>
      <div className="flex items-center gap-1 mb-1">
        <Label htmlFor={`batch-${label}`} className="text-xs font-medium">
          {label}
        </Label>
        {showTooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="rounded-full border border-gray-300 w-4 h-4 inline-flex items-center justify-center text-xs focus:outline-none">
                  ?
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Input
        id={`batch-${label}`}
        type="number"
        value={value}
        onChange={(e) => onChange?.(Number.parseInt(e.target.value, 10))}
        className="h-8"
      />
    </div>
  );
};

export default BatchEditInput;
