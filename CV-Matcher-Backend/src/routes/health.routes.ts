import { Router } from "express";
import { getHealthStatus } from "../controller/health.controller";

const healthRouter = Router();

healthRouter.get("/health", getHealthStatus);

export default healthRouter;
