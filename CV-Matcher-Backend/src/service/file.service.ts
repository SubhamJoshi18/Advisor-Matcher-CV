import broker from "../queues/serviceManager";
import getFileUtilsInstance from "../utils/file.utils";
import publishToValidationQueue from "../queues/publisher/validation.publisher";
import statusManager from "../database/schemas/statusManager.schema";
import FileManager from "../database/schemas/fileManager.schema";
import statusCode from "http-status-codes";
import getMongoInsertOperationInstance from "../database/operations/insert.operation";
import { HttpExceptions } from "../exceptions";
import { IFileContent } from "../interface/file.interface";
import { checkKeyAndRetrieve, objectReplace } from "../utils/ocmmon.utils";
import { getS3BucketPath, uploadToS3Buckets } from "../helpers/s3Bucket.helper";
import { fileProcessConfig } from "../constant/status.constant";
import { cvLogger } from "../libs/logger/logger.libs";
import { prepareQueuePayloadForValidation } from "../utils/queue.utils";

async function processCVFileService(content: Partial<IFileContent>) {
  const rabbitmqBroker = broker();
  const s3BucketPath = await getS3BucketPath();
  const fileInstance = getFileUtilsInstance();
  const mongoInsertInstance = getMongoInsertOperationInstance();

  const isValidCVContent = fileInstance.isCVFile(
    Object.prototype.hasOwnProperty.call(content, "fieldname")
      ? (content.fieldname as string)
      : ""
  );

  if (!isValidCVContent) {
    throw new HttpExceptions(
      statusCode.BAD_GATEWAY,
      `The Content is not CV, Please Insert the CV To Match the Advisor`
    );
  }

  const isFileSizeValid = fileInstance.isValidFileSize(
    checkKeyAndRetrieve(content, "size")
  );

  if (!isFileSizeValid) {
    throw new HttpExceptions(
      statusCode.BAD_GATEWAY,
      `The CV You Entered is Empty,Please Enter Valid CV`
    );
  }

  const uploadStatus = await uploadToS3Buckets(
    checkKeyAndRetrieve(content, "path"),
    s3BucketPath
  );

  const getPayload = await objectReplace(content);

  const isinsertResponse = await mongoInsertInstance.insertOperation(
    getPayload,
    FileManager
  );
  const statusPayload = Object.freeze({
    status: fileProcessConfig.PROCESSING,
  });

  const insertStatus = await mongoInsertInstance.insertOperation(
    statusPayload,
    statusManager
  );

  cvLogger.info(`Publishing The Payload to the Broker`);

  const payload = prepareQueuePayloadForValidation(content as IFileContent);

  const brokerChannel = await rabbitmqBroker.getBrokerChannel();

  const isPublish = await publishToValidationQueue(brokerChannel, payload);

  const isClosed = await rabbitmqBroker.closeBrokerChannel();

  await fileInstance.deleteFileByPath(content.path as string);

  if (typeof isPublish === "boolean" && !isPublish) {
    throw new HttpExceptions(
      statusCode.BAD_GATEWAY,
      `The Broker Cannot Publish the Message`
    );
  }

  return {
    brokerPublish: isPublish,
    brokerClose: isClosed,
    isFileManagerCreate: isinsertResponse,
    isStatusCreate: insertStatus,
  } as const;
}

export default processCVFileService;
