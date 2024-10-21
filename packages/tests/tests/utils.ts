import * as path from "path";
import * as fs from "fs";

export function loadJsonFile(filepath: string) {
  if (!path.isAbsolute(filepath)) {
    filepath = path.join(process.cwd(), filepath);
  }
  try {
    return JSON.parse(fs.readFileSync(filepath, "utf8"));
  } catch (e) {
    console.error(e);
    return null;
  }
}
