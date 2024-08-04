const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;
const semver = require("semver");

const getRemoteVersion = (pkgName) => {
  const remoteVersion = execSync(`npm show ${pkgName} version`, {
    encoding: "utf8",
    stdio: "pipe",
  }).trim();
  return remoteVersion;
};

function publishIfNeeded(dirPath) {
  const fullPath = path.join(dirPath, "package.json");
  if (!fs.existsSync(fullPath)) {
    console.warn(`🔺路径 ${fullPath} 中未找到 package.json 文件，跳过。`);
    return;
  }
  const publish = () => {
    execSync(`cd ${dirPath} && pnpm install && pnpm publish --no-git-checks`, {
      stdio: "inherit",
    });
    // console.log(`[DEBUG] publish emit: ${fullPath}`);
    // const now_version = require(fullPath).version;
    // console.log(`[DEBUG] publish emit: ${now_version}`);
  };

  const pkg = require(fullPath);
  if (pkg.publishConfig?.access !== "public") {
    console.log(`🔒 ${pkg.name} 不是公开包，跳过。`);
    return;
  }
  try {
    console.log(`📗 检查 ${pkg.name} 的远程版本...`);
    const remoteVersion = getRemoteVersion(pkg.name);
    if (semver.gt(pkg.version, remoteVersion)) {
      console.log(`🚀 ${pkg.name} 的本地版本高于远程版本，开始打包并发布...`);
      publish();
    } else {
      console.log(
        `✅ ${pkg.name} 的远程版本不低于本地版本，不执行打包和发布。`
      );
    }
  } catch (error) {
    if (
      error.message.includes("is not in this registry") &&
      error.message.includes("404")
    ) {
      console.warn(
        `❗ 包 ${pkg.name} 未在 npm registry 中注册，开始打包并发布...`
      );
      publish();
      return;
    }
    console.error(`⚠️ 执行 ${pkg.name} 的脚本时出现错误:`, error.message);
  }
}

function checkPackages(dirPath) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    let filePath = path.join(dirPath, file);
    let isDirectory = fs.lstatSync(filePath).isDirectory();
    if (isDirectory) {
      publishIfNeeded(filePath);
    }
  });
}

checkPackages(path.join(__dirname, "..", "packages"));
