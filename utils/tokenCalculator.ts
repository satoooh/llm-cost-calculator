import { encode } from "gpt-tokenizer"

export function calculateTokens(text: string): number {
  const tokens = encode(text)
  // 固定補正値（約7トークン）を適用
  return tokens.length + 7
}

