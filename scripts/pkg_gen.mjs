import * as fs from "fs";
import * as path from "path";
import { URL } from "node:url";

const __filename = new URL("", import.meta.url).pathname.slice(1);
const __dirname = new URL(".", import.meta.url).pathname.slice(1);

/**
 * @type {import("./pkgs.config.json")}
 */
const packages = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./pkgs.config.json"), "utf-8")
);

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach((element) => {
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

const readTokenizerConfig = (model_dir) => {
  const config_path = path.join(model_dir, "tokenizer_config.json");
  if (!fs.existsSync(config_path)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(config_path, "utf-8"));
};

const modify_json_file = (file_path, modify_fn) => {
  const data = fs.readFileSync(file_path, "utf-8");
  const json = JSON.parse(data);
  modify_fn(json);
  fs.writeFileSync(file_path, JSON.stringify(json, null, 2));
};

const replace_in_file = (file_path, search, replace) => {
  const data = fs.readFileSync(file_path, "utf-8");
  fs.writeFileSync(file_path, data.replaceAll(search, replace));
};

// 基于 pkg_template 文件夹生成 pkg 文件夹
const main = () => {
  console.log(
    `Generating packages in ${process.cwd()}, using ${__dirname} as template.`
  );

  for (const pkg of packages) {
    const { name, globalName } = pkg;
    const pkg_dir = path.join(process.cwd(), "packages", name);
    const pkg_template_dir = path.join(__dirname, "pkg_template");

    const tokenizer_config = readTokenizerConfig(path.join(pkg_dir, "models"));

    // copy&overwrite pkg_template 文件夹下的所有文件到 pkg 文件夹
    copyFolderSync(pkg_template_dir, pkg_dir);
    console.log(`Generated package ${name} in ${pkg_dir}`);

    // replace src/main.ts "PreTrainedTokenizer" => tokenizer_config.tokenizer_class
    if (tokenizer_config?.tokenizer_class) {
      const main_ts_path = path.join(pkg_dir, "src/main.ts");
      replace_in_file(
        main_ts_path,
        "PreTrainedTokenizer",
        tokenizer_config.tokenizer_class
      );
      console.log(
        `Replaced PreTrainedTokenizer with ${tokenizer_config.tokenizer_class} in ${main_ts_path}`
      );
    }

    const package_name = `@lenml/tokenizer-${name}`;

    // 修改 package.json 文件
    // name => `@lenml/tokenizer-${name}`
    // keywords => .push(name)
    const pkg_json_path = path.join(pkg_dir, "package.json");
    modify_json_file(pkg_json_path, (json) => {
      json.name = package_name;
      json.keywords ||= [];
      json.keywords.push(name);

      json.description = `${name} tokenizer for NodeJS/Browser`;
    });

    // replace tsup.config.ts 中的 "AutoTokenizer" 为 globalName
    const tsup_config_path = path.join(pkg_dir, "tsup.config.ts");
    replace_in_file(tsup_config_path, "AutoTokenizer", globalName);

    // replace readme.md 中 "<<package_name>>" => package_name
    const readme_path = path.join(pkg_dir, "readme.md");
    replace_in_file(readme_path, "<<package_name>>", package_name);
  }
};

main();
