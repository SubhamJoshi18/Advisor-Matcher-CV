import { Request, Response, NextFunction } from "express";
import { UnknownOrAny } from "../types/data-type";
import { cvLogger } from "../libs/logger/logger.libs";
import processCVFileService from "../service/file.service";
import { IFileContent } from "../interface/file.interface";
import { sendGenericRespone } from "../common/common.response";

async function processFileAsCV(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const fileContent = req.file as Partial<IFileContent>;
    const apiResponse = await processCVFileService(fileContent);
    const message = `The Process Has been Started, Processing the CV`;
    return sendGenericRespone(res, apiResponse, message);
  } catch (err: UnknownOrAny) {
    cvLogger.error(
      `Error Processing the File as CV, Error : ${(err as Error).message}`
    );
    next(err);
  }
}

export { processFileAsCV };
