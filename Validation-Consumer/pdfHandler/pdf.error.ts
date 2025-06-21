import { consuemrLogger } from "../libs/common.logger";

async function pdfErrorHandler(errData: any) {
  try {
    console.log(errData);
  } catch (err: any) {
    consuemrLogger.error(`Error Handling the PDF , Error Due to : ${err}`);
    throw err;
  }
}

export default pdfErrorHandler;
