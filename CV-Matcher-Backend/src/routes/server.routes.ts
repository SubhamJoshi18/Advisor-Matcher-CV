import { Application, RequestHandler, Router } from "express";
import { RouteNotFound } from "../common/common.response";
import healthRouter from "./health.routes";

async function initalizeServerRoutes(app: Application) {
  app.use("/api/v1", [healthRouter]);
}

export default initalizeServerRoutes;
