import { Request, Response, NextFunction } from "express";
import { UnknownOrAny } from "../types/data-type";
import { getAllStatusHealth } from "../service/health.service";
import { cvLogger } from "../libs/logger/logger.libs";
import { sendGenericRespone } from "../common/common.response";

async function getHealthStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const apiResponse = await getAllStatusHealth();
    const apiMessage = `Health Status of Service Advisor-Matcher-CV`;
    sendGenericRespone(res, apiResponse, apiMessage);
  } catch (err: UnknownOrAny) {
    cvLogger.error(`Error Checking the Health Status of the Services`);
    next(err);
  }
}

export { getHealthStatus };
