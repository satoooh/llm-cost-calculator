interface Model {
  name: string
  inputPrice: number
  outputPrice: number
}

interface CostResult {
  modelName: string
  inputTokens: number
  outputTokens: number
  inputCost: number
  outputCost: number
  totalCost: number
}

export function calculateCosts(models: Model[], inputTokens: number, outputTokens: number): CostResult[] {
  return models.map((model) => {
    const inputCost = inputTokens ? (inputTokens / 1000000) * model.inputPrice : 0
    const outputCost = outputTokens ? (outputTokens / 1000000) * model.outputPrice : 0
    const totalCost = inputCost + outputCost

    return {
      modelName: model.name,
      inputTokens,
      outputTokens,
      inputCost,
      outputCost,
      totalCost,
    }
  })
}

