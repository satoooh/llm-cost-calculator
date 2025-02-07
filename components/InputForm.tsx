"use client";

import type React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InputFormProps {
  inputText: string;
  outputText: string;
  onInputChange: (text: string) => void;
  onOutputChange: (text: string) => void;
  callCount: number;
  onCallCountChange: (count: number) => void;
}

const InputForm: React.FC<InputFormProps> = ({
  inputText,
  outputText,
  onInputChange,
  onOutputChange,
  callCount,
  onCallCountChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="input" className="text-sm font-medium">
              入力テキスト
            </Label>
          </div>
          <Textarea
            id="input"
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="入力テキストを入力してください"
            className="h-32 resize-none"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="output" className="text-sm font-medium">
              出力テキスト（想定）
            </Label>
          </div>
          <Textarea
            id="output"
            value={outputText}
            onChange={(e) => onOutputChange(e.target.value)}
            placeholder="想定される出力テキストを入力してください"
            className="h-32 resize-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label
          htmlFor="callCount"
          className="text-sm font-medium whitespace-nowrap"
        >
          呼び出し回数
        </Label>
        <Input
          id="callCount"
          type="number"
          value={callCount}
          onChange={(e) => onCallCountChange(parseInt(e.target.value, 10))}
          min={1}
          className="w-32"
        />
      </div>
    </div>
  );
};

export default InputForm;
