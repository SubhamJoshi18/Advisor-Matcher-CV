import path from "path";
import {
  createDirectory,
  writeFileInJson,
  checkFileExists,
  readJSON,
} from "./file.helper";

async function writeDatabaseStatusOnJson(status: boolean) {
  const statusFolder = path.join(process.cwd(), "src", "Status");
  await createDirectory(statusFolder);
  await writeFileInJson(status, statusFolder);
}

async function readJSONBody(jsonFilePath: string) {
  const baseName = path.basename(jsonFilePath, path.extname(jsonFilePath));
  const jsonFileName = `${baseName}.json`;
  const concatFileName = path.join(jsonFilePath, jsonFileName);
  if (await checkFileExists(jsonFilePath)) {
    return JSON.parse(await readJSON(concatFileName));
  }
}

export { writeDatabaseStatusOnJson, readJSONBody };
