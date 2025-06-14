import { cvLogger } from "../libs/logger/logger.libs";
import { copyFile } from "./file.helper";
import path from "path";

async function getS3BucketPath() {
  const bucketPath = path.join(process.cwd()).split("/").slice(0, -1);
  const finalPath = bucketPath.join("/");
  return finalPath.endsWith("/")
    ? finalPath + "S3Bucket"
    : finalPath + "/" + "S3Bucket";
}

async function uploadToS3Buckets(
  sourcePath: string,
  destinationFolder: string
) {
  return new Promise(async (resolve, reject) => {
    const fileName = path.basename(sourcePath);
    const finalDestinationBucketPrefix = destinationFolder + "/" + fileName;
    await copyFile(sourcePath, finalDestinationBucketPrefix);
    cvLogger.info(`${fileName} Uploaded Successfully to the S3Buckets`);
    resolve(true);
  });
}

export { getS3BucketPath, uploadToS3Buckets };
