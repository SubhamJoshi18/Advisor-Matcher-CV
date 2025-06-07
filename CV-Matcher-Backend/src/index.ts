import statusFolder from "./constant/path.constant";
import { deleteStatusJson } from "./helpers/file.helper";
import { cvLogger } from "./libs/logger/logger.libs";
import ExpressServer from "./server";
import { NumAndStr } from "./types/data-type";
import { getEnvValue } from "./utils/env.utils";

async function initServer() {
  const port = getEnvValue("PORT");
  const serverInstance = new ExpressServer(port as NumAndStr);
  await deleteStatusJson(statusFolder);
  await serverInstance.startServer();
}

(async () => {
  await initServer();
})();
