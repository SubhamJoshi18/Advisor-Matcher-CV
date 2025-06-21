import path from "path";
import fsPromise from "fs/promises";
import { cvLogger } from "../libs/logger/logger.libs";

class FileUtils {
  public isCVFile(fileType: string) {
    return (
      typeof fileType === "string" && fileType.toLowerCase().includes("cv")
    );
  }

  public isValidFileSize(fileSize: number) {
    return typeof fileSize === "number" && fileSize.toString().endsWith(".0")
      ? Math.floor(fileSize) > 0
      : fileSize > 0;
  }

  public async deleteFileByPath(filePath: string): Promise<void> {
    try {
      const resolvedPath = path.resolve(filePath);
      await fsPromise.access(resolvedPath);
      await fsPromise.unlink(resolvedPath);
      cvLogger.info(`File deleted successfully: ${resolvedPath}`);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        cvLogger.error(`⚠️ File not found, nothing to delete: ${filePath}`);
      } else {
        cvLogger.error(`Error deleting file: ${filePath}`, error.message);
      }
    }
  }
}

const getFileUtilsInstance = () => {
  return new FileUtils();
};

export default getFileUtilsInstance;
