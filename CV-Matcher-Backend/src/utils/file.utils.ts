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
}

const getFileUtilsInstance = () => {
  return new FileUtils();
};

export default getFileUtilsInstance;
