interface Model {
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
}

export function calculateCosts(
  models: Model[],
  inputTokens: number,
  outputTokens: number
): CostResult[] {
  return models.map((model) => {
    const inputCost = model.inputPrice;
    const outputCost = model.outputPrice;
    const totalCost =
      (inputTokens * inputCost + outputTokens * outputCost) / 1000000;

    return {
      modelName: model.name,
      provider: model.provider,
      inputTokens,
      outputTokens,
      inputCost,
      outputCost,
      totalCost,
      contextWindow: model.contextWindow,
    };
  });
}
