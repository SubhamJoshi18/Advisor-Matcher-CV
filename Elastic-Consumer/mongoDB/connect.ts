import mongoose from "mongoose";
import { getEnvValue } from "../utils/env.utils";
import { elasticLogger } from "../libs/common.libs";

async function connectMongoDB() {
  let retryCount = 5;
  let retryStatus = true;

  while (retryCount > 0 && retryStatus) {
    try {
      const connection = await mongoConnection();
      elasticLogger.info(`Database Connected SuccessFully`);
      return connection;
    } catch (err: any) {
      const isExceeded = retryCount.toString().startsWith("0");

      if (isExceeded) {
        elasticLogger.error(`Maximum Retry Count Has been Exeeded`);
        process.exit(1);
      }

      elasticLogger.error(
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
  return mongoConnection;
}

export default connectMongoDB;
