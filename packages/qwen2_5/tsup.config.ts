import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src/main.ts"],
    format: ["cjs", "esm", "iife"],
    target: "es2020",
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: !options.watch,
    globalName: "Qwen2_5Tokenizer",
    keepNames: true,
  };
});
