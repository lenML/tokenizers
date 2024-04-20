from transformers import (
    LlamaTokenizerFast,
)
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--file", type=str, required=True, help="The path to the tokenizer file"
    )
    parser.add_argument(
        "--out",
        type=str,
        default="./tokenizer.json",
        help="The directory to save the output file",
    )
    args = parser.parse_args()

    fast_tokenizer = LlamaTokenizerFast(args.file)
    fast_tokenizer.backend_tokenizer.save(args.out)
