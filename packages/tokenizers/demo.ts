import { TokenizerLoader, tokenizers } from "./src/main";

import * as tokenizerJSON from "./models/llama3/tokenizer.json";
import * as tokenizerConfig from "./models/llama3/tokenizer_config.json";

import * as tokenizerJSON2 from "./models/claude-v1-tokenization.json";

const main = async () => {
  // const tokenizer = await TokenizerLoader.fromPreTrained({
  //   tokenizerJSON,
  //   tokenizerConfig,
  // });
  // //   console.log(tokenizer);

  // console.log(tokenizer.encode("Hello, my dog is cute"));

  // console.log(
  //   tokenizer._encode_text(
  //     "<|begin_of_text|>user\nHello, my dog is cute<|end_of_text|>"
  //   )
  // );

  const tokenizer = new tokenizers.PreTrainedTokenizer(tokenizerJSON2, {});
  console.log(
    tokenizer.encode("Hello, my dog is cute", null, {
      add_special_tokens: true,
    })
  );
  console.log(tokenizer._encode_text("Hello, my dog is cute"));
};

main()
  .then(() => console.log("Done!"))
  .catch((e) => console.error(e));
