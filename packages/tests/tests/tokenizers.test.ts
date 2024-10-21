import { fromPreTrained as loadLlama3_1 } from "@lenml/tokenizer-llama3_1";
import { TokenizerLoader } from "@lenml/tokenizers/src/main";
import { loadJsonFile } from "./utils";

const MAX_TEST_EXECUTION_TIME = 60_000; // 60 seconds

describe("tokenizers", () => {
  it(
    "should add token type ids if user requests them",
    async () => {
      const tokenizer = loadLlama3_1();

      {
        // Without text pair
        const model_inputs = tokenizer("hello", {
          //   return_tensor: false,
          return_token_type_ids: true,
        });
        const expected = {
          input_ids: [128000, 15339],
          attention_mask: [1, 1],
          token_type_ids: [0, 0],
        };
        expect(model_inputs).toEqual(expected);
      }

      {
        // With text pair
        const model_inputs = tokenizer("hello", {
          text_pair: "world",
          //   return_tensor: false,
          return_token_type_ids: true,
        });
        const expected = {
          input_ids: [128000, 15339, 128000, 14957],
          attention_mask: [1, 1, 1, 1],
          token_type_ids: [0, 0, 1, 1],
        };
        expect(model_inputs).toEqual(expected);
      }
    },
    MAX_TEST_EXECUTION_TIME
  );

  it("#5 apply_chat_template()", () => {
    // https://github.com/xenova/transformers.js/issues/879
    // https://github.com/lenML/tokenizers/issues/5
    const tokenizer = loadLlama3_1();
    const chat = [
      { role: "user", content: "Hello, how are you?" },
      {
        role: "assistant",
        content: "I'm doing great. How can I help you today?",
      },
      {
        role: "user",
        content: "I'd like to show off how chat templating works!",
      },
    ];
    // Just test it without error.
    const tokens = tokenizer.apply_chat_template(chat);
    expect(tokens).toBeInstanceOf(Array);
  });

  it("#7 Should load tokenizer of T5", () => {
    // source from https://github.com/lenML/tokenizers/issues/7
    const tokenizerJSON = loadJsonFile("./test-inputs/t5-small/tokenizer.json");
    const tokenizerConfig = loadJsonFile(
      "./test-inputs/t5-small/tokenizer_config.json"
    );
    const tokenizer = TokenizerLoader.fromPreTrained({
      tokenizerJSON,
      tokenizerConfig,
    });

    const ids = tokenizer.encode("test");
    tokenizer.decode(ids);
  });
});
