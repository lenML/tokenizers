import type { NSTokenizerConfig, NSTokenizerJSON } from "@lenml/tokenizers";

import * as rawTokenizerJSON from "../models/tokenizer.json";
import * as rawTokenizerConfig from "../models/tokenizer_config.json";

const tokenizerJSON = rawTokenizerJSON as NSTokenizerJSON.Root;
const tokenizerConfig = rawTokenizerConfig as NSTokenizerConfig.Root;

export { tokenizerJSON, tokenizerConfig };
