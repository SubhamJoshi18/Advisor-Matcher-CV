import { consuemrLogger } from "../libs/common.logger";

async function transformPDFData(pdfData: any) {
  const errorMessage: any[] = [];

  return new Promise((resolve, reject) => {
    try {
      if (!pdfData || typeof pdfData !== "object") {
        throw new Error("Invalid PDF data: Expected an object");
      }

      const meta = pdfData.Meta;
      if (!meta || typeof meta !== "object") {
        throw new Error("Missing or invalid 'Meta' object");
      }

      const { Title, PDFFormatVersion } = meta;
      if (typeof Title !== "string" || Title.trim() === "") {
        throw new Error("Invalid or missing 'Title' in Meta");
      }
      if (
        typeof PDFFormatVersion !== "string" ||
        PDFFormatVersion.trim() === ""
      ) {
        throw new Error("Invalid or missing 'PDFFormatVersion' in Meta");
      }

      consuemrLogger.info(
        `Transforming the PDF: ${Title} with Format Version: ${PDFFormatVersion}`
      );

      const pdfPages = pdfData.Pages;
      if (!Array.isArray(pdfPages) || pdfPages.length === 0) {
        throw new Error("'Pages' should be a non-empty array");
      }

      for (let i = 0; i < pdfPages.length; i++) {
        const page = pdfPages[i];

        if (!page || typeof page !== "object") {
          throw new Error(`Page ${i + 1} is not a valid object`);
        }

        const { Width, Height, HLines, VLines, Fills, Texts } = page;

        if (typeof Width !== "number" || Width <= 0) {
          throw new Error(`Invalid or missing Width in Page ${i + 1}`);
        }
        if (typeof Height !== "number" || Height <= 0) {
          throw new Error(`Invalid or missing Height in Page ${i + 1}`);
        }

        consuemrLogger.info(
          `Processing Page ${i + 1} - Width: ${Width}, Height: ${Height}`
        );

        if (!Array.isArray(HLines))
          throw new Error(`'HLines' missing in Page ${i + 1}`);
        HLines.forEach((line, j) => {
          if (
            typeof line.x !== "number" ||
            typeof line.y !== "number" ||
            typeof line.w !== "number" ||
            typeof line.l !== "number" ||
            typeof line.oc !== "string"
          ) {
            consuemrLogger.error(`Invalid HLine at Page ${i + 1}, Index ${j}`);
            throw new Error(`Invalid HLine at Page ${i + 1}, Index ${j}`);
          }
        });

        if (!Array.isArray(VLines)) {
          consuemrLogger.error(`'VLines' missing in Page ${i + 1}`);
          throw new Error(`'VLines' missing in Page ${i + 1}`);
        }

        VLines.forEach((line, j) => {
          if (
            typeof line.x !== "number" ||
            typeof line.y !== "number" ||
            typeof line.w !== "number" ||
            typeof line.l !== "number" ||
            typeof line.oc !== "string"
          ) {
            consuemrLogger.error(`Invalid VLine at Page ${i + 1}, Index ${j}`);
            throw new Error(`Invalid VLine at Page ${i + 1}, Index ${j}`);
          }
        });

        if (!Array.isArray(Fills)) {
          consuemrLogger.error(`'Fills' missing in Page ${i + 1}'`);
          throw new Error(`'Fills' missing in Page ${i + 1}`);
        }

        Fills.forEach((fill, j) => {
          if (
            typeof fill.x !== "number" ||
            typeof fill.y !== "number" ||
            typeof fill.w !== "number" ||
            typeof fill.h !== "number" ||
            typeof fill.clr !== "number"
          ) {
            consuemrLogger.error(`Invalid Fill at Page ${i + 1}, Index ${j}`);
            throw new Error(`Invalid Fill at Page ${i + 1}, Index ${j}`);
          }
        });

        if (!Array.isArray(Texts)) {
          consuemrLogger.error(`'Texts' missinzg in Page ${i + 1}`);
          throw new Error(`'Texts' missinzg in Page ${i + 1}`);
        }

        Texts.forEach((text, j) => {
          if (
            typeof text.x !== "number" ||
            typeof text.y !== "number" ||
            typeof text.w !== "number" ||
            typeof text.clr !== "number" ||
            typeof text.sw !== "number" ||
            typeof text.A !== "string" ||
            !Array.isArray(text.R)
          ) {
            consuemrLogger.error(`Invalid Text at Page ${i + 1}, Index ${j}`);
            throw new Error(`Invalid Text at Page ${i + 1}, Index ${j}`);
          }

          text.R.forEach((r: any, k: any) => {
            if (typeof r.T !== "string") {
              consuemrLogger.error(
                `Invalid Text.R[${k}] at Page ${i + 1}, Text Index ${j}`
              );
              throw new Error(
                `Invalid Text.R[${k}] at Page ${i + 1}, Text Index ${j}`
              );
            }
          });
        });
      }

      consuemrLogger.info("PDF data is valid and transformation can proceed.");
      resolve(true);
    } catch (err: any) {
      consuemrLogger.error(`Error Transforming the PDF Data: ${err.message}`);
      errorMessage.push(err.message);
    } finally {
      if (errorMessage.length.toString().startsWith("0")) {
        resolve(true);
      } else {
        resolve(errorMessage);
      }
    }
  });
}

export default transformPDFData;
