import { Request, Response, NextFunction } from "express";
import statusCode, { StatusCodes } from "http-status-codes";

function RouteNotFound(req: Request, res: Response, next: NextFunction) {
  return res.status(statusCode.NOT_FOUND).json({
    message: `Route : ${req.originalUrl} Does not Exists, Please Enter a Valid Routes`,
  });
}

function sendGenericRespone<T>(
  res: Response,
  data: T,
  message: string,
  statusCode = StatusCodes.ACCEPTED
) {
  return res.status(statusCode).json({
    message: message,
    data: data,
    statusCode: statusCode,
  });
}

export { RouteNotFound, sendGenericRespone };
