import express from "express";
import { Application } from "express";

async function initalizeServerMiddleware(app: Application) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}

export default initalizeServerMiddleware;
