import statusFolder from "../constant/path.constant";
import { HttpExceptions } from "../exceptions";
import { readJSONBody } from "../helpers/json.helper";
import { HTTP_STATUS } from "../constant/httpStatus.constant";
import { cvLogger } from "../libs/logger/logger.libs";

async function getAllStatusHealth() {
  const statusPayload = {} as any;
  const statusDecodedBody = await readJSONBody(statusFolder);

  const isValidObject = Object.entries(statusDecodedBody).length > 0;

  if (!isValidObject) {
    throw new HttpExceptions(
      HTTP_STATUS.INTERNAL_SERVER.CODE,
      `Status JSON Is Not Available to Decode `
    );
  }

  for (const [key, value] of Object.entries(statusDecodedBody)) {
    cvLogger.info(`Tracking the Status For : ${key}`);
    if (!(key in statusPayload)) {
      statusPayload[key] = value;
    }
  }
  return statusPayload;
}

export { getAllStatusHealth };
