import * as Benchmark from "benchmark";
import * as llama3 from "@lenml/tokenizer-llama3_1/src/data.ts";
import * as gpt4o from "@lenml/tokenizer-gpt4o/src/data.ts";
import { tokenizers, TokenizerLoader } from "@lenml/tokenizers/src/main.ts";

export const datasets: Record<string, string> = {
  English: `The quick brown fox jumps over the lazy dog.`,
  Chinese: `快速的棕色狐狸跳过懒狗。`,
  French: `Le renard brun rapide saute par-dessus le chien paresseux.`,
  Code: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`,
};

class TokenizerBenchmark {
  tokenizerName: string;
  tokenizer: tokenizers.PreTrainedTokenizer;

  constructor(
    tokenizerName: string,
    tokenizer: tokenizers.PreTrainedTokenizer
  ) {
    this.tokenizerName = tokenizerName;
    this.tokenizer = tokenizer;
  }

  addEncodeTests(suite: Benchmark.Suite, datasets: Record<string, string>) {
    Object.entries(datasets).forEach(([lang, text]) => {
      suite.add(`${this.tokenizerName} - encode (${lang})`, {
        // defer: true,
        fn: async (deferred) => {
          this.tokenizer.encode(text, { add_special_tokens: true });
          //   deferred.resolve();
        },
      });
    });
  }

  addDecodeTests(suite: Benchmark.Suite, datasets: Record<string, string>) {
    Object.entries(datasets).forEach(([lang, text]) => {
      suite.add(`${this.tokenizerName} - decode (${lang})`, {
        // defer: true,
        fn: async (deferred) => {
          const tokens = this.tokenizer.encode(text, {
            add_special_tokens: true,
          });
          this.tokenizer.decode(tokens);
          //   deferred.resolve();
        },
      });
    });
  }

  addApplyChatTemplateTest(suite: Benchmark.Suite) {
    suite.add(`${this.tokenizerName} - apply_chat_template`, {
      //   defer: true,
      fn: async (deferred) => {
        this.tokenizer.apply_chat_template([
          { role: "system", content: "You are helpful assistant." },
          { role: "user", content: "Hello, how are you?" },
        ]);
        // deferred.resolve();
      },
    });
  }
}

async function main() {
  const llama31Tokenizer = await TokenizerLoader.fromPreTrained(llama3);
  const gpt4oTokenizer = await TokenizerLoader.fromPreTrained(gpt4o);

  const suite = new Benchmark.Suite();
  const results: any[] = [];

  const llama31Benchmark = new TokenizerBenchmark("Llama31", llama31Tokenizer);
  const gpt4oBenchmark = new TokenizerBenchmark("GPT4o", gpt4oTokenizer);

  llama31Benchmark.addEncodeTests(suite, datasets);
  llama31Benchmark.addDecodeTests(suite, datasets);

  gpt4oBenchmark.addEncodeTests(suite, datasets);
  gpt4oBenchmark.addDecodeTests(suite, datasets);

  await suite
    .on("cycle", (event) => {
      results.push({
        name: String(event.target),
        time: event.target.times.elapsed,
      });
    })
    .on("complete", () => {
      console.table(results);
      console.log("基准测试完成。");
    })
    .run({ async: true });
}

main()
  .then(() => {})
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
