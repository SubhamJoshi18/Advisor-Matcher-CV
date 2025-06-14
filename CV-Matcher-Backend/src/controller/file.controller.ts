import { Request, Response, NextFunction } from "express";
import { UnknownOrAny } from "../types/data-type";
import { cvLogger } from "../libs/logger/logger.libs";

async function processFileAsCV(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.file);
  } catch (err: UnknownOrAny) {
    cvLogger.error(
      `Error Processing the File as CV, Error : ${(err as Error).message}`
    );
    next(err);
  }
}

export { processFileAsCV };
