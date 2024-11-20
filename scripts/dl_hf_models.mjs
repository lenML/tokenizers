import fs from "fs";
import path from "path";
import child_process, { ChildProcess } from "child_process";

const default_tokenizer_config = {
  tokenizer_class: "PreTrainedTokenizer",
};

const download_url = (repo_id, filename) =>
  `https://huggingface.co/${repo_id}/resolve/main/${filename}?download=true`;
const raw_url = (repo_id, filename) =>
  `https://raw.githubusercontent.com/${repo_id}/raw/main/${filename}`;

const default_files = (repo_id) => [
  {
    url: download_url(repo_id, "tokenizer.json"),
    url2: raw_url(repo_id, "tokenizer.json"),
    filename: "tokenizer.json",
  },
  {
    url: download_url(repo_id, "tokenizer_config.json"),
    url2: raw_url(repo_id, "tokenizer_config.json"),
    filename: "tokenizer_config.json",
  },
];
// download from tokenizer.model file
const default_model_files = (repo_id) => [
  {
    url: download_url(repo_id, "tokenizer.model"),
    filename: "tokenizer.model",
  },
  {
    url: download_url(repo_id, "tokenizer_config.json"),
    url2: raw_url(repo_id, "tokenizer_config.json"),
    filename: "tokenizer_config.json",
  },
];

const hf_repo = (user, model_name, package_name) => ({
  files: default_files(`${user}/${model_name}`),
  output_to: `./packages/${package_name}/models/`,
});
const hf_model_repo = (user, model_name, package_name) => ({
  files: default_model_files(`${user}/${model_name}`),
  output_to: `./packages/${package_name}/models/`,
});

const repos = {
  Xenova: (model_name, package_name) =>
    hf_repo("Xenova", model_name, package_name),
};

const configs = [
  // from https://gist.github.com/xenova/a452a6474428de0182b17605a98631ee
  repos.Xenova("gpt-4o", "gpt4o"),
  repos.Xenova("gpt-4", "gpt4"),
  repos.Xenova("gpt-3.5-turbo", "gpt35turbo"),
  repos.Xenova("gpt-3.5-turbo-16k", "gpt35turbo16k"),
  repos.Xenova("gpt-3", "gpt3"),
  repos.Xenova("text-davinci-002", "text_davinci002"),
  repos.Xenova("text-davinci-003", "text_davinci003"),
  repos.Xenova("text-embedding-ada-002", "text_embedding_ada002"),
  repos.Xenova("gpt2", "gpt2"),
  repos.Xenova("gpt2", "gpt2"),
  repos.Xenova("llama3-tokenizer-new", "llama3_1"),
  repos.Xenova("gemma2-tokenizer", "gemma2"),
  repos.Xenova("Llama-3.2-Tokenizer", "llama3_2"),
  // baichuan-inc/Baichuan2-7B-Chat
  hf_model_repo("baichuan-inc", "Baichuan2-7B-Chat", "baichuan2"),
  // beomi/gemma-mling-7b
  hf_repo("beomi", "gemma-mling-7b", "gemma"),
  // https://huggingface.co/mistral-community/Mixtral-8x22B-v0.1/tree/main
  hf_repo("mistral-community", "Mixtral-8x22B-v0.1", "llama2"),
  // NousResearch/Meta-Llama-3-8B
  hf_repo("NousResearch", "Meta-Llama-3-8B", "llama3"),
  // THUDM/chatglm3-6b
  hf_model_repo("THUDM", "chatglm3-6b", "chatglm3"),
  // internlm/internlm2-1_8b
  hf_repo("internlm", "internlm2-1_8b", "internlm2"),
  // CohereForAI/c4ai-command-r-plus
  hf_repo("CohereForAI", "c4ai-command-r-plus", "command_r_plus"),
  // 01-ai/Yi-34B
  hf_repo("01-ai", "YI-34B", "yi"),
  // Qwen/Qwen1.5-72B-Chat
  hf_repo("Qwen", "Qwen1.5-72B-Chat", "qwen1_5"),
  // Qwen/Qwen2.5-1.5B-Instruct
  hf_repo("Qwen", "Qwen2.5-1.5B-Instruct", "qwen2_5"),
  // aya-expanse-8b from adamo1139/aya-expanse-8b-ungated
  hf_repo("adamo1139", "aya-expanse-8b-ungated", "aya_expanse"),
  // mistral nemo 12b from nbeerbower/mistral-nemo-wissenschaft-12B
  hf_repo("nbeerbower", "mistral-nemo-wissenschaft-12B", "mistral_nemo"),

  // from gist
  {
    files: [
      {
        url: "https://public-json-tokenization-0d8763e8-0d7e-441b-a1e2-1c73b8e79dc3.storage.googleapis.com/claude-v1-tokenization.json",
        filename: "tokenizer.json",
      },
      {
        data: default_tokenizer_config,
        filename: "tokenizer_config.json",
      },
    ],
    output_to: "./packages/claude1/models/",
  },

  // Xenova/claude-tokenizer
  repos.Xenova("claude-tokenizer", "claude"),
];

const retry = async (fn, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Error: ${error.message}`);
      console.error(`Retrying... (${i + 1}/${retries})`);
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + i * 1000 * Math.random())
      );
    }
  }
  throw new Error(`Failed after ${retries} retries`);
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const curl = async (url, output_path) => {
  ensureDir(path.dirname(output_path));
  if (!path.isAbsolute(output_path)) {
    output_path = path.join(process.cwd(), output_path);
  }
  if (fs.existsSync(output_path)) {
    console.log(`File ${output_path} already exists, skipping download.`);
    return;
  }
  const proxy = process.env.HTTP_PROXY || process.env.http_proxy;
  let cmd = `curl -L ${url} -o ${output_path}`;

  if (proxy) {
    cmd = `curl -x ${proxy} -L ${url} -o ${output_path}`;
  }

  return new Promise((resolve, reject) => {
    child_process.exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
};

const check_output_is_valid_json = (output_path) => {
  const data = fs.readFileSync(output_path, "utf8");
  try {
    JSON.parse(data);
    return true;
  } catch (error) {
    return false;
  }
};

const export_model_to_single_json = (model_file_path) => {
  // 使用 python 脚本导出模型到单个 json 文件
  // python ./scripts/export_model.py --file xxx/xxx.model --out xxx/xxx.json
  let cmd = `python ./scripts/export_model.py --file ${model_file_path} --out ${model_file_path.replace(
    ".model",
    ".json"
  )}`;

  return new Promise((resolve, reject) => {
    child_process.exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
};

const dl_after_process = async (file_path) => {
  if (file_path.endsWith(".model")) {
    console.log(`converting model file ${file_path} to json...`);
    await export_model_to_single_json(file_path);
    // 保留以保证不重复下载
    // fs.unlinkSync(file_path);
  }
};

const download_model_file = async (file, output_to) => {
  const { url, url2, filename: out_filename, data } = file;
  const filename = out_filename
    ? out_filename
    : url.split("/").pop().split("?")[0];
  const output_path = path.join(output_to, filename);

  if (fs.existsSync(output_path)) {
    if (
      output_path.endsWith(".json") &&
      !check_output_is_valid_json(output_path)
    ) {
      // try to re-download the file
      console.log(
        `File ${output_path} is not a valid JSON file, re-downloading...`
      );
      fs.unlinkSync(output_path);
    } else {
      console.log(`File ${output_path} already exists, skipping download.`);
      return;
    }
  }

  if (data) {
    console.log(`Writing data to ${output_path}`);
    fs.writeFileSync(output_path, JSON.stringify(data, null, 2));
    console.log(`Wrote data to ${output_path}`);
    return;
  }

  console.log(`Downloading ${url} to ${output_path}`);
  try {
    await retry(() => curl(url, output_path));
    console.log(
      `Downloaded ${url} to ${output_path}, size: ${fs
        .statSync(output_path)
        .size.toLocaleString()} bytes.`
    );
    if (
      output_path.endsWith(".json") &&
      !check_output_is_valid_json(output_path)
    ) {
      // try url2
      console.warn(`[WARN] File ${output_path} is not a valid JSON file.`);
      throw new Error(`File ${output_path} is not a valid JSON file.`);
    }

    console.log(`Downloaded ${url} to ${output_path}`);
    await dl_after_process(output_path);
    return;
  } catch (error) {
    console.error(`Failed to download ${url} to ${output_path}`);
    console.error(error);
  }
  if (!url2) {
    return;
  }
  console.log(`Downloading ${url2} to ${output_path}`);
  try {
    await retry(() => curl(url2, output_path));
    console.log(
      `Downloaded ${url2} to ${output_path}, size: ${fs
        .statSync(output_path)
        .size.toLocaleString()} bytes.`
    );
    if (
      output_path.endsWith(".json") &&
      !check_output_is_valid_json(output_path)
    ) {
      console.warn(`[WARN] File ${output_path} is not a valid JSON file.`);
      console.warn(`[WARN] Please check the file ${output_path} manually.`);
    }

    console.log(`Downloaded ${url2} to ${output_path}`);
  } catch (error) {
    console.error(`Failed to download ${url2} to ${output_path}`);
    console.error(error);
  }
};

const main = async () => {
  for (const cfg of configs) {
    const { files, output_to } = cfg;
    const output_dir = path.join(process.cwd(), output_to);

    await Promise.all(
      files.map(async (file) => {
        await download_model_file(file, output_dir);
      })
    );
  }
};

main();
