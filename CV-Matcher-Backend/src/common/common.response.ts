import { Request, Response, NextFunction } from "express";
import statusCode from "http-status-codes";

function RouteNotFound(req: Request, res: Response, next: NextFunction) {
  return res.status(statusCode.NOT_FOUND).json({
    message: `Route : ${req.originalUrl} Does not Exists, Please Enter a Valid Routes`,
  });
}

export { RouteNotFound };
