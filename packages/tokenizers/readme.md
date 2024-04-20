# @lenml/tokenizers
tokenizers

> Based on `transformers.js`

# When should I use this instead of transformers.js?
Firstly, the interface and the actual code of the Tokenizer object are completely identical to those in transformers.js. However, when loading a tokenizer with this library, you're allowed to create your model directly from a JSON object without the need for internet access, relying on Hugging Face (hf) servers, or local files.

Therefore, this library becomes more convenient when you need to operate offline and only require the use of a tokenizer without the need for ONNX models.

# Usage

```ts
import { TokenizerLoader } from "@lenml/tokenizers";

// In Node.js, you can directly import
import * as tokenizerJSON from "./models/llama3/tokenizer.json";
import * as tokenizerConfig from "./models/llama3/tokenizer_config.json";

// On the web, you can handle the downloading logic yourself
const tokenizerJSON = await fetch(/* ... */).then(r => r.json());
const tokenizerConfig = await fetch(/* ... */).then(r => r.json());

const tokenizer = await TokenizerLoader.fromPreTrained({
    tokenizerJSON,
    tokenizerConfig,
});
console.log(tokenizer.encode("Hello, my dog is cute"));
```

# Full Tokenizer API
Complete api parameters and usage can be found in [transformer.js tokenizers document](https://huggingface.co/docs/transformers.js/api/tokenizers)

# License
Apache-2.0