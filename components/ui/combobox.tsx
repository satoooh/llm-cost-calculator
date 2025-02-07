"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Model {
  name: string;
  inputPrice: number;
  outputPrice: number;
}

interface ComboboxProps {
  models: Model[];
  selectedModels: string[];
  setSelectedModels: (value: string[]) => void;
  defaultSelectedModels: string[];
}

export function ModelsCombobox({
  models,
  selectedModels,
  setSelectedModels,
  defaultSelectedModels,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setSelectedModels(defaultSelectedModels);
  }, [defaultSelectedModels, setSelectedModels]); // Added defaultSelectedModels to dependencies

  const toggleModel = (modelName: string) => {
    if (selectedModels.includes(modelName)) {
      setSelectedModels(selectedModels.filter((name) => name !== modelName));
    } else {
      setSelectedModels([...selectedModels, modelName]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          モデルを選択 ({selectedModels.length})
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <div className="flex items-center px-2">
            <CommandInput placeholder="モデルを検索..." className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedModels([]);
                setOpen(false);
              }}
              className="ml-2"
            >
              リセット
            </Button>
          </div>
          <CommandList>
            <CommandEmpty>モデルが見つかりません。</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {models.map((model) => (
                <CommandItem
                  key={model.name}
                  onSelect={() => toggleModel(model.name)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedModels.includes(model.name)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {model.name}{" "}
                  <span className="text-xs text-gray-500 ml-2">
                    (${model.inputPrice}/1M / ${model.outputPrice}/1M)
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedModels.map((modelName) => {
          const model = models.find((m) => m.name === modelName);
          return (
            <Badge
              key={modelName}
              variant="secondary"
              className="text-xs flex-1 justify-between"
            >
              <span className="truncate">
                {modelName} (${model?.inputPrice}/1M / ${model?.outputPrice}/1M)
              </span>
              <button
                className="ml-1 hover:bg-secondary-foreground/10 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  toggleModel(modelName);
                }}
              >
                ×
              </button>
            </Badge>
          );
        })}
      </div>
    </Popover>
  );
}
