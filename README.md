# tokenizers

This is the central repository for the `tokenizers` project, which provides tokenization libraries for various machine learning models.


# When should I use this instead of transformers.js?
Firstly, the interface and the actual code of the Tokenizer object are completely identical to those in transformers.js. However, when loading a tokenizer with this library, you're allowed to create your model directly from a JSON object without the need for internet access, relying on Hugging Face (hf) servers, or local files.

Therefore, this library becomes more convenient when you need to operate offline and only require the use of a tokenizer without the need for ONNX models.

# Packages

Below is a table showcasing all available packages, the models they support, and their respective locations within the repository:

| Package Name            | Supported Model(s)                  | Repository Link                         |
|-------------------------|-------------------------------------|-----------------------------------------|
| `tokenizers` (core)     | N/A (Core Tokenization Library)     | [@lenml/tokenizers](./packages/tokenizers) |
| `llama2`                | Llama 2 (mistral, zephyr, vicuna)| [@lenml/llama2](./packages/llama2)       |
| `llama3`                | Llama 3                             | [@lenml/llama3](./packages/llama3)       |
| `gpt4`                  | GPT-4                               | [@lenml/gpt4](./packages/gpt4)           |
| `gpt35turbo`            | GPT-3.5 Turbo                       | [@lenml/gpt35turbo](./packages/gpt35turbo) |
| `gpt35turbo16k`         | GPT-3.5 Turbo 16k                   | [@lenml/gpt35turbo16k](./packages/gpt35turbo16k) |
| `gpt3`                  | GPT-3                               | [@lenml/gpt3](./packages/gpt3)           |
| `gemma`                 | Gemma                               | [@lenml/gemma](./packages/gemma)         |
| `claude`                | Claude 2/3                          | [@lenml/claude](./packages/claude)       |
| `claude1`               | Claude 1                            | [@lenml/claude1](./packages/claude1)     |
| `gpt2`                  | GPT-2                               | [@lenml/gpt2](./packages/gpt2)           |
| `baichuan2`             | Baichuan 2                          | [@lenml/baichuan2](./packages/baichuan2) |
| `chatglm3`              | ChatGLM 3                           | [@lenml/chatglm3](./packages/chatglm3)   |
| `command_r_plus`        | Command-R-Plus                      | [@lenml/command_r_plus](./packages/command_r_plus) |
| `internlm2`             | InternLM 2                          | [@lenml/internlm2](./packages/internlm2) |
| `qwen1_5`               | Qwen 1.5                            | [@lenml/qwen1_5](./packages/qwen1_5)     |
| `yi`                    | Yi                                  | [@lenml/yi](./packages/yi)               |
| `text_davinci002`       | Text-Davinci-002                    | [@lenml/text_davinci002](./packages/text_davinci002) |
| `text_davinci003`       | Text-Davinci-003                    | [@lenml/text_davinci003](./packages/text_davinci003) |
| `text_embedding_ada002` | Text-Embedding-Ada-002              | [@lenml/text_embedding_ada002](./packages/text_embedding_ada002) |

In addition to the pre-packaged models listed above, you can also utilize the interfaces in @lenml/tokenizers to load models independently.

# About `tokenizers`

For more information, refer to the [readme](./packages/tokenizers/src/tokenizers/readme.md) within the `tokenizers` package source.

# License

Apache-2.0