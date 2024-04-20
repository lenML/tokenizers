import {
  AutoTokenizer as _AutoTokenizer,
  PreTrainedTokenizer,
} from "./tokenizers/tokenizers";
import { NSTokenizerConfig, NSTokenizerJSON } from "./types";

type AnyDict = Record<string, any>;

interface ITokenizerModelJsonData {
  tokenizerJSON: Partial<NSTokenizerJSON.Root>;
  tokenizerConfig: Partial<NSTokenizerConfig.Root>;
}
interface ITokenizerModelUrls {
  tokenizerJSON: string;
  tokenizerConfig: string;
}

export class TokenizerLoader {
  static async fromPreTrained(
    model: ITokenizerModelJsonData
  ): Promise<PreTrainedTokenizer> {
    const { tokenizerJSON, tokenizerConfig } = model;
    if (!tokenizerJSON) {
      throw new Error("tokenizerJSON is required.");
    }
    if (!tokenizerConfig) {
      throw new Error("tokenizerConfig is required.");
    }
    // Some tokenizers are saved with the "Fast" suffix, so we remove that if present.
    const tokenizerName =
      tokenizerConfig.tokenizer_class?.replace(/Fast$/, "") ??
      "PreTrainedTokenizer";

    let cls = (_AutoTokenizer as any).TOKENIZER_CLASS_MAPPING[tokenizerName];
    if (!cls) {
      console.warn(
        `Unknown tokenizer class "${tokenizerName}", attempting to construct from base class.`
      );
      cls = PreTrainedTokenizer;
    }
    return new cls(tokenizerJSON, tokenizerConfig);
  }

  static async fromPreTrainedUrls(
    model: ITokenizerModelUrls,
    options?: {
      fetch?: any;
    } & Partial<ITokenizerModelJsonData>
  ) {
    const fetch = (options?.fetch as typeof global.fetch) ?? globalThis.fetch;
    const [tokenizerJSON, tokenizerConfig] = await Promise.all([
      fetch(model.tokenizerJSON).then((res) => res.json()),
      fetch(model.tokenizerConfig).then((res) => res.json()),
    ]);
    return TokenizerLoader.fromPreTrained({
      tokenizerJSON: {
        ...tokenizerJSON,
        ...options?.tokenizerJSON,
      },
      tokenizerConfig: {
        ...tokenizerConfig,
        ...options?.tokenizerConfig,
      },
    });
  }
}
