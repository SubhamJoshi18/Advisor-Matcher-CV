import { Request, Response, NextFunction } from "express";
import { HttpExceptions } from "../exceptions";
import { cvLogger } from "../libs/logger/logger.libs";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof HttpExceptions) {
    return res.status(error.getStatusCode()).json({
      message: error.getMessage(),
    });
  }

  cvLogger.error("Unhandled Error found. Error: " + error);

  return res.status(500).json({
    message: "Unhandle Error Found: " + error?.message,
  });
};
