import PDFParser from "pdf2json";
import { consuemrLogger } from "../libs/common.logger";
import pdfErrorHandler from "./pdf.error";
import pdfReadyHandler from "./pdf.ready";

const pdfParser = new PDFParser(this);

async function pdfHandler(pdfPath: string) {
  return new Promise((resolve, reject) => {
    try {
      pdfParser.on("pdfParser_dataError", pdfErrorHandler);
      pdfParser.on("pdfParser_dataReady", pdfReadyHandler);
      pdfParser.loadPDF(pdfPath);
      resolve(true);
    } catch (err: any) {
      consuemrLogger.info(`Error Handling the PDF, Due to : ${err}`);
      reject(err);
    }
  });
}

export default pdfHandler;
