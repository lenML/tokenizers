/**
 *
 * Retrieves a file from either a remote URL using the Fetch API or from the local file system using the FileSystem API.
 * If the filesystem is available and `env.useCache = true`, the file will be downloaded and cached.
 *
 * @param {string} path_or_repo_id This can be either:
 * - a string, the *model id* of a model repo on huggingface.co.
 * - a path to a *directory* potentially containing the file.
 * @param {string} filename The name of the file to locate in `path_or_repo`.
 * @param {boolean} [fatal=true] Whether to throw an error if the file is not found.
 * @param {PretrainedOptions} [options] An object containing optional parameters.
 *
 * @throws Will throw an error if the file is not found and `fatal` is true.
 * @returns {Promise} A Promise that resolves with the file content as a buffer.
 */
export async function getModelFile(
  path_or_repo_id,
  filename,
  fatal = true,
  options = {}
) {
  if (path_or_repo_id.startsWith("http")) {
    return fetch(path_or_repo_id + filename).then((response) => {
      if (!response.ok) {
        if (fatal) {
          throw new Error(`File not found at ${path_or_repo_id}${filename}`);
        } else {
          return null;
        }
      }
      return response.arrayBuffer();
    });
  } else {
    throw new Error(
      "Filesystem not supported, please implement your own file reading logic."
    );
  }
}

/**
 * Fetches a JSON file from a given path and file name.
 *
 * @param {string} modelPath The path to the directory containing the file.
 * @param {string} fileName The name of the file to fetch.
 * @param {boolean} [fatal=true] Whether to throw an error if the file is not found.
 * @param {PretrainedOptions} [options] An object containing optional parameters.
 * @returns {Promise<Object>} The JSON data parsed into a JavaScript object.
 * @throws Will throw an error if the file is not found and `fatal` is true.
 */
export async function getModelJSON(
  modelPath,
  fileName,
  fatal = true,
  options = {}
) {
  let buffer = await getModelFile(modelPath, fileName, fatal, options);
  if (buffer === null) {
    // Return empty object
    return {};
  }

  let decoder = new TextDecoder("utf-8");
  let jsonData = decoder.decode(buffer);

  return JSON.parse(jsonData);
}
