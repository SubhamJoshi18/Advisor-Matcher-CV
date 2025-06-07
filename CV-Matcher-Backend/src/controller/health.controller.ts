import { Request, Response, NextFunction } from "express";
import { UnknownOrAny } from "../types/data-type";
import { getAllStatusHealth } from "../service/health.service";
import { cvLogger } from "../libs/logger/logger.libs";

async function getHealthStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
  } catch (err: UnknownOrAny) {
    cvLogger.error(`Error Checking the Health Status of the Services`);
  }
}

export { getHealthStatus };
