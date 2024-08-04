import { fromPreTrained as loadLlama3_1 } from "@lenml/tokenizer-llama3_1";

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
});
