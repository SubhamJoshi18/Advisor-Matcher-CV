import { IFileContent } from "../interface/file.interface";
import getFileUtilsInstance from "../utils/file.utils";
import { HttpExceptions } from "../exceptions";
import statusCode from "http-status-codes";
import { checkKeyAndRetrieve, objectReplace } from "../utils/ocmmon.utils";
import getMongoInsertOperationInstance from "../database/operations/insert.operation";

async function processCVFileService(content: Partial<IFileContent>) {
  const fileInstance = getFileUtilsInstance();
  const mongoInsertInstance = getMongoInsertOperationInstance();

  const isValidCVContent = fileInstance.isCVFile(
    Object.prototype.hasOwnProperty.call(content, "fieldname")
      ? (content.fieldname as string)
      : ""
  );

  if (isValidCVContent) {
    throw new HttpExceptions(
      statusCode.BAD_GATEWAY,
      `The Content is not CV, Please Insert the CV To Match the Advisor`
    );
  }

  const isFileSizeValid = fileInstance.isValidFileSize(
    checkKeyAndRetrieve(content, "size")
  );

  if (isFileSizeValid) {
    throw new HttpExceptions(
      statusCode.BAD_GATEWAY,
      `The CV You Entered is Empty,Please Enter Valid CV`
    );
  }

  const getPayload = await objectReplace(content);
  const isinsertResponse = await mongoInsertInstance.insertOperation(getPayload);
  
}

export default processCVFileService;
