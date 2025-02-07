"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Result {
  modelName: string
  inputCost: number
  outputCost: number
  totalCost: number
}

interface ResultsTableProps {
  results: Result[]
  inputTokens: number
  outputTokens: number
  callCount: number
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, inputTokens, outputTokens, callCount }) => {
  if (results.length === 0) {
    return null
  }

  const formatCost = (cost: number) => {
    if (cost < 0.01) {
      return cost.toFixed(6)
    }
    return cost.toFixed(3)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>コスト計算結果</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[200px]">モデル名</TableHead>
                <TableHead className="text-right">$/M (入力)</TableHead>
                <TableHead className="text-right">$/M (出力)</TableHead>
                <TableHead className="text-right">合計コスト ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => {
                const inputCostPerM = result.inputCost * 1000000
                const outputCostPerM = result.outputCost * 1000000
                const totalCost = (result.inputCost * inputTokens + result.outputCost * outputTokens) * callCount

                return (
                  <TableRow key={result.modelName} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">{result.modelName}</TableCell>
                    <TableCell className="text-right">${formatCost(inputCostPerM)}</TableCell>
                    <TableCell className="text-right">${formatCost(outputCostPerM)}</TableCell>
                    <TableCell className="text-right font-medium">${formatCost(totalCost)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResultsTable

