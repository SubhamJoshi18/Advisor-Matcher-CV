import mongoose from "mongoose";
import { getEnvValue } from "../utils/env.utils";
import { UnknownOrAny } from "../types/data-type";
import { cvLogger } from "../libs/logger/logger.libs";
import { evaulateTheCondition, terminateServer } from "../common/common";
import { writeDatabaseStatusOnJson } from "../helpers/json.helper";
import {statusConfig} from "../constant/status.constant";

async function connectMongoDB() {
  let retryCount = 5;
  let retryStatus = true;

  while (retryCount > 0 && retryStatus) {
    try {
      const connection = await mongoConnection();
      cvLogger.info(`Database Connected SuccessFully`);
      return connection;
    } catch (err: UnknownOrAny) {
      const isExceeded = retryCount.toString().startsWith("0");

      if (isExceeded) {
        cvLogger.error(`Maximum Retry Count Has been Exeeded`);
        terminateServer();
      }

      cvLogger.error(
        `Error While Connecting to the Mongo Database, Retrying It : ${
          retryCount - 1
        }`
      );
      retryCount = retryCount - 1;
      continue;
    }
  }
}

async function mongoConnection() {
  const mongoUrl = getEnvValue("MONGO_URL");
  const mongoConnection = await mongoose.connect(mongoUrl as string);
  if (mongoConnection) {
    await writeDatabaseStatusOnJson(
      evaulateTheCondition(statusConfig["Passed"])
    );
  } else {
    await writeDatabaseStatusOnJson(
      evaulateTheCondition(statusConfig["Failed"])
    );
  }
  return mongoConnection;
}

export default connectMongoDB;
