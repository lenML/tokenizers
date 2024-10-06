import * as llama3 from "@lenml/tokenizer-llama3_1/src/data.ts";
import * as gpt4o from "@lenml/tokenizer-gpt4o/src/data.ts";
import { tokenizers, TokenizerLoader } from "@lenml/tokenizers/src/main.ts";

// 示例数据集
export const datasets: Record<string, string> = {
  English: `The quick brown fox jumps over the lazy dog.`,
  Chinese: `快速的棕色狐狸跳过懒狗。`,
  French: `Le renard brun rapide saute par-dessus le chien paresseux.`,
  Code: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`,
};

async function testTokenizers() {
  // 加载两个不同的 tokenizer
  const llama31Tokenizer = await TokenizerLoader.fromPreTrained(llama3);
  const gpt4oTokenizer = await TokenizerLoader.fromPreTrained(gpt4o);

  // 测试 encode 方法
  Object.keys(datasets).forEach((key) => {
    const text = datasets[key];

    console.log(`\nTesting encode for ${key} text with Llama31 Tokenizer:`);
    const encodedLlama = llama31Tokenizer.encode(text, {
      add_special_tokens: true,
    });
    console.log(`Encoded result (Llama31):`, encodedLlama);

    console.log(`\nTesting encode for ${key} text with GPT4o Tokenizer:`);
    const encodedGPT4o = gpt4oTokenizer.encode(text, {
      add_special_tokens: true,
    });
    console.log(`Encoded result (GPT4o):`, encodedGPT4o);
  });
}

testTokenizers()
  .then(() => {
    console.log("\nAll tests completed.");
  })
  .catch((error) => {
    console.error("Error during testing:", error);
  });
