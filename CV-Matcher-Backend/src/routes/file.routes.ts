import { Router } from "express";
import { processFileAsCV } from "../controller/file.controller";
import upload from "../config/multer.config";

const fileRouter = Router();

fileRouter.post("/upload-cv", upload.single("cv"), processFileAsCV);

export default fileRouter;
