"use client";

import { useState } from "react";
import type { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Result {
  modelName: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  contextWindow: number;
}

interface ResultsTableProps {
  results: Result[];
  inputTokens: number;
  outputTokens: number;
  callCount: number;
}

type SortConfig = {
  key: keyof Result | "perCallCost" | null;
  direction: "asc" | "desc";
};

type SortValue = string | number;

// プロバイダーごとのアイコンマッピング
const providerIcons: { [key: string]: string } = {
  OpenAI:
    "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  Anthropic: "https://avatars.githubusercontent.com/u/51382740?s=200&v=4",
  Google:
    "https://www.gstatic.com/lamda/images/favicon_v1_150160cddff7f294ce30.svg",
  "Mistral AI": "https://mistral.ai/images/logo-dark.svg",
};

const ResultsTable: FC<ResultsTableProps> = ({
  results,
  inputTokens,
  outputTokens,
  callCount,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  if (results.length === 0) {
    return null;
  }

  const formatCost = (cost: number) => {
    if (cost < 0.01) {
      return cost.toFixed(6);
    }
    return cost.toFixed(4);
  };

  const handleSort = (key: SortConfig["key"]) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortedResults = () => {
    if (!sortConfig.key) return results;

    return [...results].sort((a, b) => {
      let aValue: SortValue;
      let bValue: SortValue;

      if (sortConfig.key === "perCallCost") {
        aValue = a.inputCost * inputTokens + a.outputCost * outputTokens;
        bValue = b.inputCost * inputTokens + b.outputCost * outputTokens;
      } else {
        aValue = a[sortConfig.key as keyof Result];
        bValue = b[sortConfig.key as keyof Result];
      }

      if (aValue === null) return 1;
      if (bValue === null) return -1;
      if (aValue === null && bValue === null) return 0;

      if (typeof aValue === "string") {
        const comparison = aValue.localeCompare(bValue as string);
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      return sortConfig.direction === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  };

  const getSortIcon = (key: SortConfig["key"]) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  const sortedResults = getSortedResults();

  return (
    <Card>
      <CardHeader>
        <CardTitle>コスト計算結果</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("provider")}
                    className="hover:bg-transparent"
                  >
                    Provider {getSortIcon("provider")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("modelName")}
                    className="hover:bg-transparent"
                  >
                    Model {getSortIcon("modelName")}
                  </Button>
                </TableHead>
                <TableHead>Context</TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("inputCost")}
                    className="hover:bg-transparent ml-auto"
                  >
                    Input/M Tokens {getSortIcon("inputCost")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("outputCost")}
                    className="hover:bg-transparent ml-auto"
                  >
                    Output/M Tokens {getSortIcon("outputCost")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("perCallCost")}
                    className="hover:bg-transparent ml-auto"
                  >
                    Per Call {getSortIcon("perCallCost")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("totalCost")}
                    className="hover:bg-transparent ml-auto"
                  >
                    Total {getSortIcon("totalCost")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((result) => {
                const perCallCost =
                  (result.inputCost * inputTokens +
                    result.outputCost * outputTokens) /
                  1000000;
                const totalCost = perCallCost * callCount;

                return (
                  <TableRow
                    key={result.modelName}
                    className="hover:bg-gray-50/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {providerIcons[result.provider] && (
                          <Image
                            src={providerIcons[result.provider]}
                            alt={result.provider}
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                        )}
                        {result.provider}
                      </div>
                    </TableCell>
                    <TableCell>{result.modelName}</TableCell>
                    <TableCell>
                      {result.contextWindow?.toLocaleString() || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      ${result.inputCost.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${result.outputCost.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${formatCost(perCallCost)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${formatCost(totalCost)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsTable;
