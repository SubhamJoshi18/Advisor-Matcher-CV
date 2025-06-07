import { Application } from "express";
import express from "express";
import { NumAndStr, UnknownOrAny } from "./types/data-type";
import { cvLogger } from "./libs/logger/logger.libs";
import connectMongoDB from "./database/connect";
import initalizeServerRoutes from "./routes/server.routes";
import initalizeServerMiddleware from "./middlewares/server.middleware";

class ExpressServer {
  private port: NumAndStr = 0;

  constructor(port: NumAndStr) {
    this.port = port;
  }

  async databaseConnection() {
    await connectMongoDB();
  }

  async initalizeServerAndMiddleware(app: Application) {
    await Promise.all([
      initalizeServerMiddleware(app),
      initalizeServerRoutes(app),
    ]);
  }

  async initalizeServer(app: Application) {
    app.listen(this.port, () => {
      cvLogger.info(`Server is Starting on the Server : ${this.port}`);
    });
  }

  async startServer() {
    try {
      const app = express();
      await this.databaseConnection();
      await this.initalizeServerAndMiddleware(app);
      await this.initalizeServer(app);
    } catch (err: UnknownOrAny) {
      cvLogger.error(
        `Error While Starting the Backend For the Express Server : ${JSON.stringify(
          err.message
        )}`
      );
    }
  }
}

export default ExpressServer;
