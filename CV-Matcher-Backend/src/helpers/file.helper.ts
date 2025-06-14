import fs from "fs";
import fsPromise from "fs/promises";
import path from "path";
import { cvLogger } from "../libs/logger/logger.libs";

async function checkFileExists(filePath: string) {
  return fs.existsSync(filePath);
}

async function readJSON(filePath: string) {
  return await fsPromise.readFile(filePath, { encoding: "utf-8" });
}

async function getLocalFilePath() {
  return path.join(process.cwd(), "S3Bucket");
}

async function copyFile(sourcePath: string, destinationPath: string) {
  try {
    await fs.promises.copyFile(sourcePath, destinationPath);
    cvLogger.info("File copied successfully!");
  } catch (error) {
    cvLogger.error("Error copying file:", error);
  }
}

async function createDirectory(filePath: string) {
  if (!fs.existsSync(filePath)) {
    cvLogger.info(`File : ${filePath}  Does not Exists, Creating the File`);
    await fsPromise.mkdir(filePath, { recursive: true });
  }
  cvLogger.info(`File Already Created,Processing It`);
}

async function writeFileInJson(
  status: boolean,
  filePath: string
): Promise<void> {
  try {
    const baseName = path.basename(filePath, path.extname(filePath));
    const jsonFileName = `${baseName}.json`;
    const concatFileName = path.join(filePath, jsonFileName);
    const jsonData = JSON.stringify({ DatabaseStatus: status }, null, 2);
    await fsPromise.access(filePath, fs.constants.W_OK);
    fs.writeFileSync(concatFileName, jsonData);
    cvLogger.info(`Status written to JSON file: ${jsonFileName}`);
  } catch (error) {
    cvLogger.error(
      `Failed to write status to JSON: ${(error as Error).message}`
    );
    throw error;
  }
}

async function deleteStatusJson(filePath: string) {
  try {
    const baseName = path.basename(filePath, path.extname(filePath));
    const jsonFileName: `${string}.json` = `${baseName}.json`;
    const isFileExists = await checkFileExists(
      path.join(filePath, jsonFileName)
    );
    if (isFileExists) {
      cvLogger.info(`Deleting the File of the Status`);
      await fsPromise.unlink(path.join(filePath, jsonFileName));
    }
    cvLogger.info(`File is Already Deleted`);
  } catch (error) {
    cvLogger.error(
      `Failed to delete status to the JSON : ${(error as Error).message}`
    );
  }
}

export {
  createDirectory,
  writeFileInJson,
  deleteStatusJson,
  checkFileExists,
  getLocalFilePath,
  readJSON,
  copyFile,
};
