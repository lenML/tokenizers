# @lenml/tokenizers

This is the central repository for the `@lenml/tokenizers` project, which provides tokenization libraries for various machine learning models.


# When should I use this instead of transformers.js?
Firstly, the interface and the actual code of the Tokenizer object are completely identical to those in transformers.js. However, when loading a tokenizer with this library, you're allowed to create your model directly from a JSON object without the need for internet access, and without relying on Hugging Face (hf) servers, or local files.

Therefore, this library becomes more convenient when you need to operate offline and only require the use of a tokenizer without the need for ONNX models.

# Packages

Below is a table showcasing all available packages, the models they support, and their respective locations within the repository:

| Package Name            | Supported Model(s)                  | Repository Link                         |
|-------------------------|-------------------------------------|-----------------------------------------|
| `tokenizers` (core)     | N/A (Core Tokenization Library)     | [@lenml/tokenizers](./packages/tokenizers) |
| `llama2`                | Llama 2 (mistral, zephyr, vicuna)| [@lenml/tokenizer-llama2](./packages/llama2)       |
| `llama3`                | Llama 3                             | [@lenml/tokenizer-llama3](./packages/llama3)       |
| `gpt4o`                  | GPT-4o                               | [@lenml/tokenizer-gpt4o](./packages/gpt4o)           |
| `gpt4`                  | GPT-4                               | [@lenml/tokenizer-gpt4](./packages/gpt4)           |
| `gpt35turbo`            | GPT-3.5 Turbo                       | [@lenml/tokenizer-gpt35turbo](./packages/gpt35turbo) |
| `gpt35turbo16k`         | GPT-3.5 Turbo 16k                   | [@lenml/tokenizer-gpt35turbo16k](./packages/gpt35turbo16k) |
| `gpt3`                  | GPT-3                               | [@lenml/tokenizer-gpt3](./packages/gpt3)           |
| `gemma`                 | Gemma                               | [@lenml/tokenizer-gemma](./packages/gemma)         |
| `claude`                | Claude 2/3                          | [@lenml/tokenizer-claude](./packages/claude)       |
| `claude1`               | Claude 1                            | [@lenml/tokenizer-claude1](./packages/claude1)     |
| `gpt2`                  | GPT-2                               | [@lenml/tokenizer-gpt2](./packages/gpt2)           |
| `baichuan2`             | Baichuan 2                          | [@lenml/tokenizer-baichuan2](./packages/baichuan2) |
| `chatglm3`              | ChatGLM 3                           | [@lenml/tokenizer-chatglm3](./packages/chatglm3)   |
| `command_r_plus`        | Command-R-Plus                      | [@lenml/tokenizer-command_r_plus](./packages/command_r_plus) |
| `internlm2`             | InternLM 2                          | [@lenml/tokenizer-internlm2](./packages/internlm2) |
| `qwen1_5`               | Qwen 1.5                            | [@lenml/tokenizer-qwen1_5](./packages/qwen1_5)     |
| `yi`                    | Yi                                  | [@lenml/tokenizer-yi](./packages/yi)               |
| `text_davinci002`       | Text-Davinci-002                    | [@lenml/tokenizer-text_davinci002](./packages/text_davinci002) |
| `text_davinci003`       | Text-Davinci-003                    | [@lenml/tokenizer-text_davinci003](./packages/text_davinci003) |
| `text_embedding_ada002` | Text-Embedding-Ada-002              | [@lenml/tokenizer-text_embedding_ada002](./packages/text_embedding_ada002) |

In addition to the pre-packaged models listed above, you can also utilize the interfaces in @lenml/tokenizers to load models independently.

# Usage

## install

### npm/yarn/pnpm
```
npm install @lenml/tokenizers
```

### ESM
```html
<script type="importmap">
  {
    "imports": {
      "@lenml/tokenizers": "https://www.unpkg.com/@lenml/tokenizers@latest/dist/main.mjs"
    }
  }
</script>
<script type="module">
  import { TokenizerLoader, tokenizers } from "@lenml/tokenizers";
  console.log('@lenml/tokenizers: ',tokenizers);
</script>
```

## load tokenizer
### from json
```ts
import { TokenizerLoader } from "@lenml/tokenizers";
const tokenizer = TokenizerLoader.fromPreTrained({
    tokenizerJSON: { /* ... */ },
    tokenizerConfig: { /* ... */ }
});
```

### from urls
```ts
import { TokenizerLoader } from "@lenml/tokenizers";
const tokenizer = await TokenizerLoader.fromPreTrainedUrls({
    tokenizerJSON: "https://huggingface.co/HuggingFaceH4/zephyr-7b-gemma-v0.1/resolve/main/tokenizer.json?download=true",
    tokenizerConfig: "https://huggingface.co/HuggingFaceH4/zephyr-7b-gemma-v0.1/resolve/main/tokenizer_config.json?download=true"
});
```

### from pre-packaged tokenizer
```ts
import { fromPreTrained } from "@lenml/tokenizer-llama3";
const tokenizer = fromPreTrained();
```

## chat template
```ts
const tokens = tokenizer.apply_chat_template(
  [
    {
      role: "system",
      content: "You are helpful assistant.",
    },
    {
      role: "user",
      content: "Hello, how are you?",
    },
  ]
) as number[];

const chat_content = tokenizer.decode(tokens);

console.log(chat_content);
```
output:
```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are helpful assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>

Hello, how are you?<|eot_id|><|start_header_id|>assistant<|end_header_id|>
```

## tokenizer api
```ts
console.log(
    "encode() => ",
    tokenizer.encode("Hello, my dog is cute", null, {
        add_special_tokens: true,
    })
);
console.log(
    "_encode_text() => ",
    tokenizer._encode_text("Hello, my dog is cute")
);
```

> fully tokenizer api: [transformer.js tokenizers document](https://huggingface.co/docs/transformers.js/api/tokenizers)

## get lightweight `transformers.tokenizers`
In the `@lenml/tokenizers` package, you can get a lightweight no-dependency implementation of tokenizers:

> Since all dependencies related to huggingface have been removed in this library, although the implementation is the same, it is not possible to load models using the form `hf_user/repo`.

```ts
import { tokenizers } from "@lenml/tokenizers";

const {
    CLIPTokenizer,
    AutoTokenizer,
    CohereTokenizer,
    VitsTokenizer,
    WhisperTokenizer,
    // ...
} = tokenizers;
```

# License

Apache-2.0