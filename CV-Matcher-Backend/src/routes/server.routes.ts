import { Application, RequestHandler, Router } from "express";
import { RouteNotFound } from "../common/common.response";
import healthRouter from "./health.routes";
import { errorHandler } from "../middlewares/error.middleware";
import fileRouter from "./file.routes";

async function initalizeServerRoutes(app: Application) {
  app.use("/api/v1", [healthRouter, fileRouter]);
  app.use(errorHandler as any);
}

export default initalizeServerRoutes;
