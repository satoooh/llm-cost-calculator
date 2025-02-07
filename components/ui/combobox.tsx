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
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Model {
  name: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
}

interface ComboboxProps {
  models: Model[];
  selectedModels: string[];
  setSelectedModels: (value: string[]) => void;
  defaultSelectedModels: string[];
}

// プロバイダーごとのアイコンマッピング
const providerIcons: { [key: string]: string } = {
  OpenAI:
    "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  Anthropic: "https://avatars.githubusercontent.com/u/51382740?s=200&v=4",
  Google:
    "https://www.gstatic.com/lamda/images/favicon_v1_150160cddff7f294ce30.svg",
  "Mistral AI": "https://mistral.ai/favicon.ico",
};

export function ModelsCombobox({
  models,
  selectedModels,
  setSelectedModels,
  defaultSelectedModels,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setSelectedModels(defaultSelectedModels);
  }, [defaultSelectedModels, setSelectedModels]);

  const toggleModel = (modelName: string) => {
    if (selectedModels.includes(modelName)) {
      setSelectedModels(selectedModels.filter((name) => name !== modelName));
    } else {
      setSelectedModels([...selectedModels, modelName]);
    }
  };

  // プロバイダーごとにモデルをグループ化
  const modelsByProvider = React.useMemo(() => {
    const grouped: { [key: string]: Model[] } = {};
    models.forEach((model) => {
      if (!grouped[model.provider]) {
        grouped[model.provider] = [];
      }
      grouped[model.provider].push(model);
    });
    return grouped;
  }, [models]);

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
            {Object.entries(modelsByProvider).map(
              ([provider, providerModels]) => (
                <React.Fragment key={provider}>
                  <CommandGroup heading={provider}>
                    {providerModels.map((model) => (
                      <CommandItem
                        key={model.name}
                        onSelect={() => toggleModel(model.name)}
                        className="flex items-center"
                      >
                        <div className="flex items-center flex-1">
                          {providerIcons[provider] && (
                            <img
                              src={providerIcons[provider]}
                              alt={provider}
                              className="w-4 h-4 mr-2"
                            />
                          )}
                          <div>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 inline-block",
                                selectedModels.includes(model.name)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {model.name}
                            <span className="text-xs text-gray-500 ml-2">
                              (${model.inputPrice}/1M / ${model.outputPrice}/1M)
                            </span>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </React.Fragment>
              )
            )}
          </CommandList>
        </Command>
      </PopoverContent>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedModels.map((modelName) => {
          const model = models.find((m) => m.name === modelName);
          const provider = model?.provider;
          return (
            <Badge
              key={modelName}
              variant="secondary"
              className="text-xs flex items-center gap-2"
            >
              {provider && providerIcons[provider] && (
                <img
                  src={providerIcons[provider]}
                  alt={provider}
                  className="w-3 h-3"
                />
              )}
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
