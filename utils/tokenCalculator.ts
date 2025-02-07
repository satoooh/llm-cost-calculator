import { encode } from "gpt-tokenizer";

export function calculateTokens(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }
  const tokens = encode(text);
  return tokens.length;
}
