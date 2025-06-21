import { consuemrLogger } from "../libs/common.logger";
import transformPDFData from "./pdf.transformer";

async function pdfReadyHandler(pdfData: any) {
  try {
    return await transformPDFData(pdfData);
  } catch (err: any) {
    consuemrLogger.error(`Error Handling the PDF, Error Due to : ${err}`);
    throw err;
  }
}

export default pdfReadyHandler;
